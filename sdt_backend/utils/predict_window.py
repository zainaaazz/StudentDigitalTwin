import json
import sys
import os


DEF_LABELS = ['Distinction', 'Fail', 'Pass', 'Withdrawn']


def safe_float(value):
    try:
        return float(value)
    except Exception:
        return 0.0


def build_sequence(rows_sorted, feature_cols, scaler, day):
    import numpy as np

    # Collect raw feature vectors for rows with date < day
    raw_vectors = [
        [safe_float(row.get(col, 0.0)) for col in feature_cols]
        for row in rows_sorted
        if safe_float(row.get('date', 0)) < day
    ]

    if raw_vectors:
        raw_array = np.array(raw_vectors, dtype=float)
        scaled = scaler.transform(raw_array)
    else:
        raw_array = np.zeros((0, len(feature_cols)), dtype=float)
        scaled = raw_array

    # Pad or trim to exact window length
    if scaled.shape[0] < day:
        if scaled.shape[0] == 0:
            pad_row = np.zeros((1, len(feature_cols)), dtype=float)
        else:
            pad_row = scaled[:1, :]
        pad_len = day - scaled.shape[0]
        scaled = np.vstack([np.repeat(pad_row, pad_len, axis=0), scaled])
    elif scaled.shape[0] > day:
        scaled = scaled[-day:, :]

    tensor = scaled.reshape(1, day, len(feature_cols))
    return tensor, raw_vectors, scaled.tolist()


def main():
    try:
        import numpy as np  # noqa: F401
        import pickle
        try:
            import sklearn  # noqa: F401, ensures scaler can be deserialised
        except Exception:
            pass
        from tensorflow.keras.models import load_model
    except Exception as exc:  # noqa: BLE001
        err = {
            'success': False,
            'error': f'Python runtime missing dependencies: {exc}',
        }
        print(json.dumps(err))
        return

    try:
        payload = json.loads(sys.stdin.read())
        model_dir = payload['model_dir']
        scaler_path = payload['scaler_path']
        feats_path = payload['feats_path']
        student_id = int(payload['student_id'])
        start_day = int(payload['start_day'])
        end_day = int(payload['end_day'])
        labels = payload.get('labels') or DEF_LABELS
        rows = payload.get('rows', [])
        debug_log = bool(payload.get('debug_log'))
        debug_day_val = payload.get('debug_day')
        try:
            debug_day = int(debug_day_val) if debug_day_val is not None else start_day
        except Exception:
            debug_day = start_day

        with open(scaler_path, 'rb') as f:
            scaler = pickle.load(f)
        with open(feats_path, 'rb') as f:
            feature_cols = pickle.load(f)

        if not isinstance(feature_cols, (list, tuple)):
            feature_cols = list(feature_cols)

        rows_filtered = [r for r in rows if int(r.get('id_student', -1)) == student_id]
        rows_sorted = sorted(rows_filtered, key=lambda r: safe_float(r.get('date', 0)))

        debug_logged = False
        results = []

        for day in range(start_day, end_day + 1):
            model_path = os.path.join(model_dir, f'model_day_{day}.h5')
            if not os.path.exists(model_path):
                results.append({
                    'day': day,
                    'model_available': False,
                    'pred_label': None,
                    'pred_index': None,
                    'confidence': None,
                })
                continue

            try:
                model = load_model(model_path, compile=False)
                tensor, raw_vectors, _ = build_sequence(rows_sorted, feature_cols, scaler, day)
                preds = model.predict(tensor, verbose=0)
                if preds.ndim == 3:
                    probs = preds[0, -1, :]
                else:
                    probs = preds[0]
                probs = np.array(probs, dtype=float)
                idx = int(np.argmax(probs))
                confidence = float(probs[idx])
                label = labels[idx] if 0 <= idx < len(labels) else f'class_{idx}'

                if debug_log and not debug_logged and day == debug_day:
                    debug_payload = {
                        'event': 'azure_prediction_debug',
                        'student_id': student_id,
                        'day': day,
                        'model_path': model_path,
                        'raw_vectors': raw_vectors,
                        'scaled_tensor': tensor.reshape(day, len(feature_cols)).tolist(),
                        'probabilities': probs.tolist(),
                    }
                    print(json.dumps(debug_payload), file=sys.stderr)
                    debug_logged = True

                results.append({
                    'day': day,
                    'model_available': True,
                    'pred_label': label,
                    'pred_index': idx,
                    'confidence': confidence,
                })
            except Exception as exc:  # noqa: BLE001
                error_payload = {
                    'day': day,
                    'model_available': True,
                    'pred_label': f'ERROR: {exc}',
                    'pred_index': None,
                    'confidence': None,
                }
                print(json.dumps({
                    'event': 'azure_prediction_exception',
                    'student_id': student_id,
                    'day': day,
                    'model_path': model_path,
                    'error': str(exc)
                }), file=sys.stderr)
                results.append(error_payload)

        print(json.dumps({'success': True, 'data': results}))
    except Exception as exc:  # noqa: BLE001
        print(json.dumps({'success': False, 'error': str(exc)}))


if __name__ == '__main__':
    main()
