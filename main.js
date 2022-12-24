var time = new Date();
console.log(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());


// --------------------------- USUARIOS --------------------------------
class User{
    constructor(dpi, name, username, password, phone, admin, id, passwordC){
        this.dpi = dpi;
        this.name = name;
        this.username = username;
        this.password = password;
        this.phone = phone;
        this.admin = admin;
        this.passwordC = passwordC;
        this.next = null;
        this.id = id;
        this.friends = new stackFriend();
        this.block = new queueBlock();
        this.playlist = new doubleListPlaylist();
    }
}

class listUsers{
    constructor(){
        this.head = null;
        this.last = null;
        this.size = null;
    }

    stringToHashConversion(string) {
        for(var i = 0, hash = 0; i < string.length; i++)
        hash = Math.imul(31, hash) + string.charCodeAt(i) | 0;
        return hash;
       }

    addUser(dpi, name, username, password, phone, admin){
        this.size++;
        let encript = this.stringToHashConversion(password);
        var newUser = new User(dpi, name, username, password, phone, admin, this.size, encript);
        if(this.head == null){
            this.head = newUser;
            this.last = newUser;
        }else{
            this.last.next = newUser;
            this.last = newUser;
            this.last.next = this.head.next;
        }
    }

    findUser(user){
        var tmp = this.head;
        if(tmp != null){
            for(var i = 0; i < this.size; i++){
                if(tmp.username == user){
                    return tmp
                }
                tmp = tmp.next;
            }
        }
        return null;
    }

    findUserLogin(user, pass){
        let tmp = this.head;
        if(tmp != null){
            for(var i = 0; i < this.size; i++){
                if(tmp.username == user && tmp.password == pass){
                    return tmp;
                }
                tmp = tmp.next;
            }
        }
        return null;
    }

    printUsers(){
        let tmp = this.head;
        if(tmp != null){
            for (var i = 0; i < this.size; i++) {
                console.log(tmp);
                tmp = tmp.next;
            }
        }
    }

    printCardUsers(){
        let tmp = this.head;
        var texto = "";
        if(tmp != null){
            for (var i = 0; i < this.size; i++) {
                texto += `<div class="card" style="width: 18rem; float: left;">
                        <img src="images/music.jpg" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${tmp.name}</h5>
                            <p class="card-text">${tmp.username}</p>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">DPI: ${tmp.dpi}</li>
                            <li class="list-group-item">Número de Teléfono: ${tmp.phone}</li>
                        </ul>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item"><button type="button" class="btn btn-success" onclick="addFriend('${tmp.username}')">Agregar</button></li>
                                <li class="list-group-item"><button type="button" class="btn btn-danger" onclick="blockFriend('${tmp.username}')">Bloquear</button></li>
                            </ul>
                        </div>
                    </div>`;
                tmp = tmp.next;
            }
            return texto;
        }
        return "";
    }
 

    grafica(){
        var graphUser = "digraph G { \n rankdir=\"LR\";\n";
        var nodoaux = this.head;
        
        for(let i = 0; i < this.size; i++){
            graphUser += "user" + nodoaux.id + "[label=\"" + nodoaux.username + "\"];\n";
            
            nodoaux = nodoaux.next;
        }
        nodoaux = this.head;
        for(let i = 0; i < this.size - 1; i++){
            if(nodoaux.next != null){
                graphUser += "user" + nodoaux.id + "->" + "user" + (nodoaux.id + 1) + ";\n";
            }
            nodoaux = nodoaux.next;
        }
        
        graphUser += "}";
        //console.log(graphUser);
        return graphUser;
    }
}


//---------------------------------- PELICULAS --------------------------------
class nodePelicula {
    constructor(id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria) {
        this.id_pelicula = id_pelicula;
        this.nombre_pelicula = nombre_pelicula;
        this.descripcion = descripcion;
        this.puntuacion_star = puntuacion_star;
        this.precio_Q = precio_Q;
        this.paginas = paginas;
        this.categoria = categoria;
        this.izquierdo = null;
        this.derecho = null;
        this.altura = 0;
    }

    insertar(id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria){
        if(id_pelicula < this.id_pelicula) {
            if(this.izquierdo == null) {
                this.izquierdo = new nodePelicula(id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria);
            }else{
                this.izquierdo.insertar(id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria);
            }
        }else if(id_pelicula > this.id_pelicula) {
            if(this.derecho == null) {
                this.derecho = new nodePelicula(id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria);
            } else {
                this.derecho.insertar(id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria);
            }
        }else{
            
        }
    }

    graphPelicula(){
        return "digraph grafica{\n" +
               'rankdir=TB;\n label="Arbol AVL";\nfontsize="50";\n'+
               'node [ style=filled , fillcolor=darkgoldenrod2];\n'+
                this.graphPeliculaNode()+
                "}\n";
    }

    graphPeliculaNode(){
        var texto = "";
        if(this.izquierdo == null && this.derecho == null){
            texto ="nodo"+this.id_pelicula+'[label=\"nombre:'+this.nombre_pelicula+'\n'+'id:'+this.id_pelicula+'"];\n';
        }else{
            texto ="nodo"+this.id_pelicula+'[label=\"nombre:'+this.nombre_pelicula+'\n'+'id:'+this.id_pelicula+'"];\n';
        }
        if(this.izquierdo != null){
            texto = texto + this.izquierdo.graphPeliculaNode() +
               "nodo"+this.id_pelicula+"->nodo"+this.izquierdo.id_pelicula+"\n";
        }
        if(this.derecho!=null){
            texto = texto + this.derecho.graphPeliculaNode() +
               "nodo"+this.id_pelicula+"->nodo"+this.derecho.id_pelicula+"\n";                    
        }
        return texto;
    }
}

class Arbol_AVL{
    constructor(){
        this.raiz = null;
    }

    insertar(id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria){
        this.raiz = this.insertarNodo(this.raiz, id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria);
    }

    insertarNodo(nodo, id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria){
        if(nodo == null){
            nodo = new nodePelicula(id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria);
        }else if(id_pelicula < nodo.id_pelicula){
            nodo.izquierdo = this.insertarNodo(nodo.izquierdo, id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria);
            if(this.altura(nodo.derecho) - this.altura(nodo.izquierdo) == -2){
                if(id_pelicula < nodo.izquierdo.id_pelicula){
                    nodo = this.rotacionizquierda(nodo);
                }else{
                    nodo = this.Rotaciondobleizquierda(nodo);
                }
            }
        }else if(id_pelicula > nodo.id_pelicula){
            nodo.derecho = this.insertarNodo(nodo.derecho,id_pelicula,nombre_pelicula,descripcion,puntuacion_star,precio_Q);
            if(this.altura(nodo.derecho) - this.altura(nodo.izquierdo)== 2){
                if(id_pelicula > nodo.derecho.id_pelicula){
                    nodo = this.rotacionderecha(nodo);
                }else{
                    nodo = this.Rotaciondoblederecha(nodo);
                }
            }
        }else{
            console.log("No se puede insertar un nodo con el mismo id");
        }
        nodo.altura = this.mayor(this.altura(nodo.izquierdo),this.altura(nodo.derecho))+1;
        return nodo;
    }

    altura(nodo){
        if(nodo == null){
            return -1
        }
        return nodo.altura;
    }

    mayor(valor1,valor2){
        if(valor1>valor2){
            return valor1;
        }
        return valor2;
    }

    rotacionizquierda(nodo){
        var aux = nodo.izquierdo;
        nodo.izquierdo = aux.derecho;
        aux.derecho = nodo;
        //calculo de nueva altura
        nodo.altura = this.mayor(this.altura(nodo.derecho),this.altura(nodo.izquierdo))+1;
        aux.altura = this.mayor(this.altura(nodo.izquierdo), nodo.altura)+1;
        return aux;
    }

    rotacionderecha(nodo){
        var aux = nodo.derecho;
        nodo.derecho = aux.izquierdo;
        aux.izquierdo = nodo;
        //calcular de nuevo altura
        nodo.altura = this.mayor(this.altura(nodo.derecho),this.altura(nodo.izquierdo))+1;
        aux.altura = this.mayor(this.altura(nodo.derecho),nodo.altura)+1;
        return aux;
    }

    //rotacion dobles derecha
    Rotaciondoblederecha(nodo){
        nodo.derecho = this.rotacionizquierda(nodo.derecho);
        return this.rotacionderecha(nodo);
    }

    //rotaciones dobles
    Rotaciondobleizquierda(nodo){
        nodo.izquierdo = this.rotacionderecha(nodo.izquierdo);
        return this.rotacionizquierda(nodo);
    }

    graficar(){
        var actual;
        actual = this.raiz;
        var hola = actual.obtenerGraphviz();
        console.log(hola);
        d3.select("#Arbol_AVL").graphviz()
            .zoom(false)
            .renderDot(hola)

    }

    inorden(){
        var res =document.querySelector("#tablaPeliculas");
        res.innerHTML = "";
        this.inordenAux(this.raiz,res);
    }

    inordenAux(nodo,res){
        var respuesta = res;
        if(nodo != null){
            this.inordenAux(nodo.izquierdo,respuesta);
            respuesta.innerHTML +=
            "<tr>"+
                "<td>"+nodo.nombre_pelicula+"</td>"+
                "<td>"+nodo.descripcion+"</td>"+
                "<td></td>"+
                "<td></td>"+
                "<td>"+nodo.precio_Q+"</td>"+
            "</tr>";
            this.inordenAux(nodo.derecho,respuesta);
        }
    }

    descendente(){
        var res =document.querySelector("#tablaPeliculas");
        res.innerHTML = "";
        this.desAux(this.raiz,res);
    }

    desAux(nodo,res){
        var respuesta = res;
        if(nodo != null){
            this.desAux(nodo.derecho,respuesta);
            respuesta.innerHTML +=
            "<tr>"+
                "<td>"+nodo.nombre_pelicula+"</td>"+
                "<td>"+nodo.descripcion+"</td>"+
                "<td></td>"+
                "<td></td>"+
                "<td>"+nodo.precio_Q+"</td>"+
            "</tr>";
            this.desAux(nodo.izquierdo,respuesta);
        }
    }
}

//------------------------------- VARIABLES GLOBALES --------------------------
var actualUser = null;
var Users = new listUsers();
var Movies = new Arbol_AVL();

//-----------------Admin Auxiliar---------------------------------------
Users.addUser(2654568452521, "Oscar Armin", "EDD", "123", 1234567, true);


//------------------------------ ADMINISTRADOR ---------------------------------

// ---- Carga Masiva Usuarios
document.getElementById('masivaUsuarios').addEventListener('change', leerArchivoUsuario, false);
function leerArchivoUsuario(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
        var contenido = e.target.result;
        loadUsers(contenido);
    };
    lector.readAsText(archivo);
}

function loadUsers(content){
    var datos = JSON.parse(content);
    for (var i = 0; i < datos.length; i++) {
       Users.addUser(datos[i].dpi,datos[i].name,datos[i].username,datos[i].password,datos[i].phone,datos[i].admin);
    }
   // listaUsuarios.graficarUsuarios();
   Users.printUsers();
   console.log("Total de Usuarios cargados: " + Users.size);
    alert("Usuarios cargados"); 
}



// ---- Carga Masiva Peliculas
document.getElementById('masivaPelicula').addEventListener('change', leerArchivoPelicula, false);
function leerArchivoPelicula(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
        var contenido = e.target.result;
        loadPelicula(contenido);
    };
    lector.readAsText(archivo);
}

function loadPelicula(content){
    var datos = JSON.parse(contenido);
    for (var i = 0; i < datos.length; i++) {
        Movies.insertar(datos[i].id_pelicula,datos[i].nombre_pelicula,datos[i].descripcion,datos[i].puntuacion_star,datos[i].precio_Q,datos[i].paginas, datos[i].categoria);
    }
    alert("Peliculas cargadas");
    Movies.graficar();
    Movies.inorden();
     alert("Películas cargadas"); 
}