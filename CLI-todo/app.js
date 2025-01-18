import Readline from 'readline';

const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const todos = [];

const showMenu = () => {
    console.log("\n 1: Add a Task");
    console.log("2. View Tasks");
    console.log("3. Exit");
    rl.question("Choose an option: ", handleInput)
}

const handleInput = (option) => {
    if(option === "1"){
        rl.question("Enter the Task:", (task) => {
            todos.push(task);
            console.log("Task added: ",task);
            showMenu();
        })
    
    }else if(option === "2"){
        console.log("\n Your Todo Lists");
        todos.forEach((task, index) => {
             console.log(`${index+1}. ${task}`);
             showMenu();
        })
    }else if(option === "3"){
        console.log("Good Bye");
        rl.close();
    }else{
        console.log("Invalid Option,please try again");
        
    }
}

showMenu();