const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');

function logError(context, err) {
  const message = err && err.message ? err.message : err;
  console.error(`[AZURE] ${context}:`, message);
  if (err && err.stack) {
    console.error(err.stack);
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    const message = `${name} is not configured`;
    logError('Missing environment variable', new Error(message));
    throw new Error(message);
  }
  return value;
}

function normalizeSas(sas) {
  return sas.startsWith('?') ? sas : `?${sas}`;
}

let cachedContainerClient = null;

function getContainerClient() {
  if (cachedContainerClient) {
    return cachedContainerClient;
  }

  try {
    const account = requireEnv('AZURE_STORAGE_ACCOUNT_NAME');
    const container = requireEnv('AZURE_STORAGE_CONTAINER');
    const sasToken = normalizeSas(requireEnv('AZURE_STORAGE_SAS_TOKEN'));

    const serviceUrl = `https://${account}.blob.core.windows.net${sasToken}`;
    const blobServiceClient = new BlobServiceClient(serviceUrl);
    cachedContainerClient = blobServiceClient.getContainerClient(container);
    return cachedContainerClient;
  } catch (err) {
    logError('Failed to initialize Azure container client', err);
    throw err;
  }
}

function sanitizeBlobName(name) {
  if (typeof name !== 'string' || !name.trim()) {
    const error = new Error('Blob name is required');
    logError('Invalid blob name', error);
    throw error;
  }
  if (name.includes('..') || name.includes('//') || name.startsWith('/')) {
    const error = new Error('Invalid blob name');
    logError('Invalid blob name', error);
    throw error;
  }
  return name.trim();
}

async function listModelBlobs() {
  try {
    const containerClient = getContainerClient();
    const results = [];

    for await (const blob of containerClient.listBlobsFlat()) {
      if (!blob?.name || !blob.name.endsWith('.h5')) {
        continue;
      }

      const { properties = {} } = blob;
      results.push({
        name: blob.name,
        size: typeof properties.contentLength === 'number' ? properties.contentLength : null,
        lastModified: properties.lastModified instanceof Date ? properties.lastModified.toISOString() : null,
        etag: properties.etag || null
      });
    }

    results.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    return results;
  } catch (err) {
    logError('Failed to list Azure model blobs', err);
    throw err;
  }
}

async function getModelDownloadUrl(blobName) {
  try {
    const name = sanitizeBlobName(blobName);
    const containerClient = getContainerClient();
    const blobClient = containerClient.getBlobClient(name);
    const exists = await blobClient.exists();

    if (!exists) {
      const error = new Error('Blob not found');
      error.statusCode = 404;
      logError(`Blob not found for ${name}`, error);
      throw error;
    }

    return blobClient.url;
  } catch (err) {
    logError('Failed to get model download URL', err);
    throw err;
  }
}

async function downloadBlobToFile(blobName, destinationPath) {
  try {
    const name = sanitizeBlobName(blobName);
    const containerClient = getContainerClient();
    const blobClient = containerClient.getBlobClient(name);
    const exists = await blobClient.exists();

    if (!exists) {
      const error = new Error('Blob not found');
      error.statusCode = 404;
      logError(`Blob not found for ${name}`, error);
      throw error;
    }

    await fs.promises.mkdir(path.dirname(destinationPath), { recursive: true });

    try {
      await fs.promises.rm(destinationPath, { force: true });
    } catch (rmErr) {
      logError(`Failed to clear existing file at ${destinationPath}`, rmErr);
      // continue; file removal failure should not stop the download
    }

    await blobClient.downloadToFile(destinationPath, undefined, {
      blockSize: 4 * 1024 * 1024,
      concurrency: 4,
    });

    let props = null;
    try {
      props = await blobClient.getProperties();
    } catch (propErr) {
      logError(`Failed to read blob properties for ${name}`, propErr);
      props = null;
    }

    const info = {
      name,
      path: destinationPath,
      size: props && typeof props.contentLength === 'number' ? props.contentLength : null,
      lastModified: props && props.lastModified instanceof Date ? props.lastModified.toISOString() : null,
      etag: props && props.etag ? props.etag : null
    };

    console.info(`[AZURE] Downloaded ${name} -> ${destinationPath}`);
    return info;
  } catch (err) {
    logError(`Failed to download blob ${blobName}`, err);
    throw err;
  }
}

module.exports = {
  listModelBlobs,
  getModelDownloadUrl,
  downloadBlobToFile
};
