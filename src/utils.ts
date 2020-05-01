export const renameObjKeys = (obj: Object, map: { [k: string]: string }) => {
  Object.keys(obj).forEach(k => {
    if (!map[k] || map[k] == k) return;
    obj[map[k]] = obj[k];
    delete obj[k];
  });
  return obj;
};
