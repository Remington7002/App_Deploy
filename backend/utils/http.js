class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const fail = (status, message) => { throw new HttpError(status, message); };
const clean = value => typeof value === 'string' ? value.trim() : '';
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { HttpError, fail, clean, escapeRegExp };
