export const reducer = (state, obj) => {
    Object.keys(obj).forEach(p => {
        if (!obj.hasOwnProperty(p)) return;
        state[p] = obj[p];
    });
};

