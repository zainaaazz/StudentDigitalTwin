const { BlobServiceClient } = require('@azure/storage-blob');

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
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

  const account = requireEnv('AZURE_STORAGE_ACCOUNT_NAME');
  const container = requireEnv('AZURE_STORAGE_CONTAINER');
  const sasToken = normalizeSas(requireEnv('AZURE_STORAGE_SAS_TOKEN'));

  const serviceUrl = `https://${account}.blob.core.windows.net${sasToken}`;
  const blobServiceClient = new BlobServiceClient(serviceUrl);
  cachedContainerClient = blobServiceClient.getContainerClient(container);
  return cachedContainerClient;
}

function sanitizeBlobName(name) {
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error('Blob name is required');
  }
  if (name.includes('..') || name.includes('//') || name.startsWith('/')) {
    throw new Error('Invalid blob name');
  }
  return name.trim();
}

async function listModelBlobs() {
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
}

async function getModelDownloadUrl(blobName) {
  const name = sanitizeBlobName(blobName);
  const containerClient = getContainerClient();
  const blobClient = containerClient.getBlobClient(name);
  const exists = await blobClient.exists();

  if (!exists) {
    const error = new Error('Blob not found');
    error.statusCode = 404;
    throw error;
  }

  return blobClient.url;
}

module.exports = {
  listModelBlobs,
  getModelDownloadUrl
};
