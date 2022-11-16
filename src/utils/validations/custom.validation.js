const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({ custom: '"{{#label}}" is invalid' });
  }
  return value;
};

module.exports = {
  objectId,
};
