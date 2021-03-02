

const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => {
            listeners.push(callback);
            callback(value, value);
        },
        getValue: ()       => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            listeners.forEach(callback => callback(value, oldValue));
        }
    }
};


const ObservableList = list => {
    const addListeners = [];
    const delListeners = [];
    const removeAt     = array => index => array.splice(index, 1); //The slice() method returns the selected elements in an array, as a new array object.
    //The slice() method selects the elements starting at the given start argument, and ends at, but does not include, the given end argument.
    const removeItem   = array => item  => { const i = array.indexOf(item); if (i>=0) removeAt(array)(i); };
    const listRemoveItem     = removeItem(list);
    const delListenersRemove = removeAt(delListeners);
    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach( listener => listener(item))
        },
        del: item => {
            listRemoveItem(item);
            const safeIterate = [...delListeners]; // shallow copy as we might change listeners array while iterating
            safeIterate.forEach( (listener, index) => listener(item, () => delListenersRemove(index) ));
        },
        removeDeleteListener: removeItem(delListeners),
        count:   ()   => list.length,
        countIf: pred => list.reduce( (sum, item) => pred(item) ? sum + 1 : sum, 0)
    }
};
