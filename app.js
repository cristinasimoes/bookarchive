//Book constructer
class Book{
  constructor(title, author, isbn){
    this.title=title;
    this.author=author;
    this.isbn=isbn;
  }
}
var x = document.getElementById('continue');
x.style.display = 'none';



class UI{
 
 addBookToList(id,bookFound){
    const list = document.getElementById(id);
    //create an element
    const row = document.createElement('tr');
    
    if(id==='book-list-find'){
      row.innerHTML = `
      <td>${bookFound.title}</td>
      <td>${bookFound.author}</td>
      <td>${bookFound.isbn}</td>
    `;  
    }else{
      //insert cols
      row.innerHTML = `
      <td>${bookFound.title}</td>
      <td>${bookFound.author}</td>
      <td>${bookFound.isbn}</td>
      <td>
      <a href="#" class ="delete">
        <i class="far fa-trash-alt"></i>
      </a></td>
    `;  
    }
    list.appendChild(row);
  }

  showAlert(message,page) {
    //create li
    const li = document.createElement("li");
    //add class name
    li.className = `box`;

    li.appendChild(document.createTextNode(message));
    document.getElementById(page).appendChild(li);

    //timeout after 3 sec
    setTimeout(function(){
      document.querySelector('.box').remove();
    }, 9000);
  }

  deleteBook(target,icon){
    if(target.className===icon){
      target.parentElement.parentElement.parentElement.remove();
    }
  }

  clearFields(page){
    function clear(name){
      document.getElementById(name).value = '';
    }
    if(page=== 1){
      clear('title');
      clear('author');
      clear('isbn');
    }else{
      clear('findTitle');
      clear('findAuthor');
      clear('findIsbn');
    }
  }
}

//Local storage class
class Store{
  static backgroundGradient(c1,c2){
    var body = document.getElementById("gradient");
  
    body.style.background= 
    "linear-gradient(to right, " 
    + c1.value 
    + ", " 
    + c2.value 
    + ")"; 
  }

  static setColorsFromLS(color1, color2){
    let x, i,y;
    x = document.querySelectorAll(".colorLeft");
    y = document.querySelectorAll(".colorRight");
    for (i = 0; i < x.length; i++) {
      x[i].value=color1;
      y[i].value=color2;
    }
    Store.backgroundGradient(x[1],y[1]);
  }
  static storeColor(color1,color2){
    localStorage.setItem('LScolor1', color1.value);
    localStorage.setItem('LScolor2', color2.value);
    Store.setColorsFromLS(color1.value,color2.value);
  }

  static setGradient(i){
    let color1 = document.querySelectorAll(".colorLeft")[i];
    let color2 = document.querySelectorAll(".colorRight")[i];
    Store.storeColor(color1,color2);
  }

  static displayColors(){
    //get color from ls
    let LScolor1 = localStorage.getItem('LScolor1');
    let LScolor2 = localStorage.getItem('LScolor2');
 
    if (localStorage.getItem("LScolor1") === null) {
      //gives color to the circle
      Store.setColorsFromLS('#062f3b', '#18b78a');
    }else{
      Store.setColorsFromLS(LScolor1, LScolor2);
    }
  }

  static getBooks(){
    let books;
    if(localStorage.getItem('books')=== null){
      books = [];
    }else{
      books= JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static searchBooks(book){
    const books = Store.getBooks();
    let found = false;

    books.forEach(function(bookLS, index){
      const title=book.title.toUpperCase(),
            author=book.author.toUpperCase(),
            isbn=book.isbn.toUpperCase(),
            titleLS=bookLS.title.toUpperCase(),
            authorLS=bookLS.author.toUpperCase(),
            isbnLS=bookLS.isbn.toUpperCase();

      function addBook(){
        const ui = new UI;
        var x = document.getElementById('continue');

        ui.addBookToList('book-list-find',bookLS);
        document.getElementById('table').removeAttribute("style");
        found=true;

        x.style.display = 'block';  
        document.getElementById('book-form-find').style.display='none';
      }

      if(title === titleLS && author === authorLS){addBook();}else{
        if(title === titleLS && author === ''){addBook();}else{
          if(title === '' && author === authorLS){addBook();}else{
            if(isbn === isbnLS){addBook();}
          }
        }
      }
    });

    if(found === false){
      const ui = new UI;
      ui.showAlert('Book not found','alert2');
      document.getElementById('book-form-find').style.display='block';
    }
  }

  static displayBooks(){
    const books = Store.getBooks();
    books.forEach(function(book){
      const ui = new UI;

      //add book to UI
      ui.addBookToList('book-list',book);
    });
  }

  static addBook(book){
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books',JSON.stringify(books));
  }

  static removeBook(isbn){
    const books = Store.getBooks();
    
    books.forEach(function(book, index){
      if(book.isbn === isbn){
        books.splice(index,1);
      }
    });
    localStorage.setItem('books',JSON.stringify(books));
  }

}

//DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayColors);
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//Event Listeners for add book
document.getElementById('book-form-add').addEventListener('submit',
function(e){
  //Get input values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value
  //instantiate book
  const book = new Book(title, author, isbn);
  //instantiate UI
  const ui = new UI();

  if(title=== '' || author==='' || isbn===''){
    ui.showAlert('please fill in all fields','alert1');
  }else{
    //add book to list
    ui.addBookToList('book-list',book);
    //add do LS
    Store.addBook(book);
    //show alert
    const msg = title + ' by ' + author + ' was added!';
    ui.showAlert(msg,'alert1');
    //clear fields
    ui.clearFields(1);
  }
  e.preventDefault();
});

//Event Listeners for read book
document.getElementById('book-form-find').addEventListener('submit',
function(e){
  //Get input values
  const title = document.getElementById('findTitle').value,
        author = document.getElementById('findAuthor').value,
        isbn = document.getElementById('findIsbn').value
  //instantiate book
  const book = new Book(title, author, isbn);
  //instantiate UI
  const ui = new UI();
  
  if(title=== '' && author==='' & isbn===''){
    ui.showAlert('please fill at least one in field','alert2');
  }else Store.searchBooks(book);
  //clear fields
  ui.clearFields();
  e.preventDefault();
});

//event listener for continue
document.getElementById('continue').addEventListener('click',
function(e){
  var table = document.getElementById('table');
  var continueBtn = document.getElementById('continue');
  var list = document.getElementById("book-list-find");
  let form = document.getElementById('book-form-find');

  form.style.display='block';
  table.style.display = "none";
  continueBtn.style.display = 'none';
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
  e.preventDefault();
  });

// Event listener for delete
document.getElementById('book-list').addEventListener('click',function(e){
  //instantiate UI
  const ui = new UI();

  const titulo = e.target.parentElement.parentElement
  .previousElementSibling.previousElementSibling.previousElementSibling.textContent;
  const author = e.target.parentElement.parentElement
  .previousElementSibling.previousElementSibling.textContent;
  const msg = titulo + ' by ' + author + ' was removed!';

  //Delete book
  ui.deleteBook(e.target,'far fa-trash-alt');
  //remove book from LS
  Store.removeBook(e.target.parentElement.parentElement
    .previousElementSibling.textContent);

    //show alert
    ui.showAlert(msg,'alert3');
  e.preventDefault();
});

// Event listener for Color Circles
document.querySelectorAll(".colorLeft")[0].addEventListener("input",
function(e){Store.setGradient(0);});
document.querySelectorAll(".colorRight")[0].addEventListener("input",
function(e){Store.setGradient(0);});
document.querySelectorAll(".colorLeft")[1].addEventListener("input",
function(e){Store.setGradient(1);});
document.querySelectorAll(".colorRight")[1].addEventListener("input",
function(e){Store.setGradient(1);});
document.querySelectorAll(".colorLeft")[2].addEventListener("input",
function(e){Store.setGradient(2);});
document.querySelectorAll(".colorRight")[2].addEventListener("input",
function(e){Store.setGradient(2);});

// localStorage.clear();

