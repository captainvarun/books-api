const deleteAtPath = (object, path, index) => {
  if (index === path.length - 1) {
    delete object[path[index]];
    return;
  }
  deleteAtPath(object[path[index]], path, index + 1);
};

const toJSON = (schema) => {
  let transform;
  if (schema.options.toJSON && schema.options.toJSON.transform) transform = schema.options.toJSON.transform;

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      if (transform) return transform(doc, ret, options);
    },
  });
};

module.exports = toJSON;
