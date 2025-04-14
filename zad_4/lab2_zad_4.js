const students = [
        {first_name:'Jan' , last_name:'Kowalski',photo:"https://www.investopedia.com/thmb/r-ykjZLW9I4RmbU-drQ3hrksqdM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-2130374028-337261d83cc5416eb5bd23f2905a44ee.jpg"},
        {first_name:'Joanna' , last_name:'Ptak', photo:"https://st.depositphotos.com/1011643/4715/i/450/depositphotos_47157715-stock-photo-college-student-looking-up.jpg"},
        {first_name:'Michał' , last_name:'Anioł',photo:"https://thumbs.dreamstime.com/b/high-school-student-29699566.jpg"},
        {first_name:'Marysia' , last_name:'Lis',photo:"https://st2.depositphotos.com/4431055/11856/i/950/depositphotos_118562150-stock-photo-young-student-girl.jpg"},
]

const subjectstable = [
        {subject:"Matematyka"},
        {subject:"Polski"},
        {subject:"Angielski"},
        {subject:"Niemiecki"}
]

let db
const request = indexedDB.open("student",1)

request.onupgradeneeded = (event) =>{
        db = event.target.result;
        //tablica z imionami i nazwiskami
        if(!db.objectStoreNames.contains("first_name&last_name")){
               const store = db.createObjectStore("first_name&last_name",{keyPath:"id",autoIncrement:true});
               store.createIndex("first_name","first_name",{unique:false});
               store.createIndex("last_name","last_name",{unique:false});
                store.createIndex("photo","photo",{unique:false});
        }

        //tablica z przedmiotami

        if(!db.objectStoreNames.contains("subjects")){
                const store = db.createObjectStore("subjects",{keyPath:"id",autoIncrement:true});
                store.createIndex("subject","subject",{unique:false});
        }
        //tworzę tablicę z ocenami
        if(!db.objectStoreNames.contains("notes")){
                const store = db.createObjectStore("notes",{keyPath:"student_id"});
                store.createIndex("student_id","student_id",{unique:false});
                store.createIndex("notes","notes",{unique:false});
        }
}

request.onsuccess = (event) =>{

        db = event.target.result;

        const transaction = db.transaction(["first_name&last_name","subjects","notes"],"readwrite");

        //dodaje dane do first_name&last_name
        const first_namelast_nameStore = transaction.objectStore("first_name&last_name");

        students.forEach(student => {first_namelast_nameStore.add(student);});

        //dodaje dane do subjects

        const subjectsStore = transaction.objectStore("subjects");
        subjectstable.forEach(subject => {subjectsStore.add(subject);});

        //dodaje dane do notes

        // const notesStore = transaction.objectStore("notes");
        //
        // students.forEach(student => {
        //         subjectstable.forEach(subject => {
        //                         //tworzę klucz dla oceny dla każdego studenta (wiem że jeżeli imie i nazwisko się potwórzy to będzie problem
        //                 // ale w takim wypadku możemy do klucza dodać jeszce jedną wartość np. numer albumu)
        //                 let new_student = student.first_name + "_" + student.last_name + "_" + subject.subject;
        //
        //                 const new_note = {student_id: new_student , note: 0};
        //
        //                 notesStore.add(new_note);
        //
        //         });
        // })

}
request.onerror = (event) =>{

        console.error(event.target.error);
}

function checkIfStudentExists(string_key){

        return new Promise(resolve =>{

                const splitString = string_key.split(" ");

                let request = indexedDB.open("student",1);
                request.onsuccess = (event) =>{
                        db = event.target.result;
                        let transaction = db.transaction("first_name&last_name","readonly");
                        let store = transaction.objectStore("first_name&last_name");
                        let name = store.index("first_name");
                        let nameRequest = name.getAll(splitString[0])

                        nameRequest.onsuccess = (event) =>{
                                student = event.target.result;

                                let matchingStudent = students.find(student => student.last_name === splitString[1]);

                                if(matchingStudent){
                                        resolve(true);
                                }
                                else  resolve(false);
                        }
                }

        })

}


async function changeNote(string_key){
        let exists = await checkIfStudentExists(string_key);
        if(exists) {

                const splitString = string_key.split(" ");
                let request = indexedDB.open("student", 1);
                request.onsuccess = (event) => {
                        db = event.target.result;
                        let transaction = db.transaction("notes", "readwrite");
                        let store = transaction.objectStore("notes")

                        let newNote = {
                                student_id: splitString[0] + "_" + splitString[1] + "_" + splitString[2],
                                note: splitString[3]
                        };
                        let addNewNote = store.put(newNote);

                        addNewNote.onsuccess = (event) => {
                                alert("zmieniono ocene")
                        }
                        addNewNote.onerror = (event) => {
                                alert("error nie zmieniono oceny")
                        };

                }
        }
        else{
                alert("Podany student nie istnieje")
        }

}

async function addNote(string_key){
        let exists = await checkIfStudentExists(string_key);
        if(exists) {
        const splitString = string_key.split(" ");
        let request = indexedDB.open("student",1);
        request.onsuccess = (event) =>{
                db = event.target.result;
                let transaction = db.transaction("notes","readwrite");
                let store = transaction.objectStore("notes")

                let newNote = {student_id:splitString[0] + "_" + splitString[1] + "_" + splitString[2],note: splitString[3]};
                let addNewNote =  store.add(newNote);

                addNewNote.onsuccess = (event) =>{alert("dodano ocene")}
                addNewNote.onerror = (event) =>{alert("error nie dodano oceny")};

        }
        }
        else {
                alert("Podany student nie istnieje")
        }
}



async function viewNote(string_key){
        let exists = await checkIfStudentExists(string_key);
        if(exists) {
        const splitString = string_key.split(" ");
        let request = indexedDB.open("student",1);
        request.onsuccess = (event) =>{
                db = event.target.result;
                let transaction = db.transaction("notes","readonly");
                let store = transaction.objectStore("notes")
                let getNote = store.index("student_id").get(splitString[0] + "_" + splitString[1] + "_" + splitString[2]);

                getNote.onsuccess = (event) => {
                        let result = event.target.result;
                        console.log(splitString[0] + "_" + splitString[1] + "_" + splitString[2]);
                        if (result) {
                                // Wypisuje dane, jeśli wynik istnieje
                                resultDiv.innerHTML = splitString[0] + " " + splitString[1] + " " + splitString[2] + " - Ocena: " + result.note;
                        } else {
                                // Jeśli nie znaleziono rekordu, wyświetl odpowiednią wiadomość
                                resultDiv.innerHTML = "Brak oceny dla " + splitString[0] + " " + splitString[1];
                        }
                };
                getNote.onerror = (event) =>{console.log("error nie wyswietlono oceny")};
        }
        }
        else{
                alert("Podany student nie istnieje")
        }
}


// obsługa przycisków
const studentInput = document.getElementById("studentInput");
const addBtn = document.getElementById("add")
const changeBtn = document.getElementById("change")
const showBtn = document.getElementById("show")
const resultDiv = document.getElementById("showResultDiv")

addBtn.addEventListener("click", (event) =>{addNote(studentInput.value)})
changeBtn.addEventListener("click", (event) =>{changeNote(studentInput.value)})
showBtn.addEventListener("click", (event) =>{viewNote(studentInput.value)})
