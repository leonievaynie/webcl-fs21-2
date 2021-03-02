
// execute asynchronous tasks in strict sequence
const Scheduler = () => { //Constructor
    let inProcess = false;
    const tasks = [];
    function process() {
        if (inProcess) return;
        if (tasks.length === 0) return;
        inProcess = true;
        const task = tasks.pop(); //The pop() method removes the last element of an array, and returns that element.
        const prom = new Promise( (ok, reject) => task(ok) );
        //create promise = new Promise((resolve, reject) => {}); executor, function that resolves a value, or rejects (error)
        //declare: resolve(what to do when value arrived), reject(what to do when operation failed)
        prom.then( _ => { //consume promise ->then. = function that handles fulfillment, waits for async value to be fulfilled,
            //when that happens it will this function the value as its argument
            inProcess = false;
            process();
        });
    }
    function add(task) {
        tasks.unshift(task); //The unshift() method adds new items to the beginning of an array, and returns the new length.
        process();
    }
    return {
        add: add,
        addOk: task => add( ok => { task(); ok(); }) // convenience
    }
};
