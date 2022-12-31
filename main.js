var time = new Date();
console.log(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());


// --------------------------- USUARIOS --------------------------------
class User{
    constructor(dpi, nombre_completo, nombre_usuario, correo, contrasenia, telefono, id, admin){
        this.dpi = dpi;
        this.name = nombre_completo;
        this.username = nombre_usuario;
        this.correo = correo;
        this.password = contrasenia;
        this.phone = telefono;
        this.admin = admin;
        this.next = null;
        this.id = id;
    }
}

class listUsers{
    constructor(){
        this.head = null;
        this.last = null;
        this.size = null;
    }



    addUser(dpi, nombre_completo, nombre_usuario, correo, contrasenia, telefono, admin){
        this.size++;
        var newUser = new User(dpi, nombre_completo, nombre_usuario, correo, contrasenia, telefono, this.size, admin);
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
        var aux = this.head;
        
        for(let i = 0; i < this.size; i++){
            graphUser += "user" + aux.id + "[label=\"" + aux.username + "\"];\n";
            aux = aux.next;
        }
        aux = this.head;
        for(let i = 0; i < this.size - 1; i++){
            if(aux.next != null){
                graphUser += "user" + aux.id + "->" + "user" + (aux.id + 1) + ";\n";
            }
            aux = aux.next;
        }

        graphUser += "}";
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
               'rankdir=TB;\n\nfontsize="50";\n'+
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
        var graph = actual.graphPelicula();
        console.log(graph);
        
        
        return graph;
 
    }

    inorden(){
        var res = document.querySelector("#tablaPeliculas");
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

//---------------------------------- ACTORES ----------------------------------
class NodoActor{
    constructor(dni,nombre,correo,descripcion){
        this.dni = dni
        this.nombre = nombre
        this.correo = correo
        this.descripcion = descripcion
        this.izquierda = null
        this.derecha = null
    }
}

class ArbolABB{
    constructor(){
        this.raiz =  null
        this.codigodot = ""
        this.mostrar = ""
    }

    insertar(dni,nombre,correo,descripcion){
        this.raiz = this.Agregar(dni,nombre,correo,descripcion,this.raiz)
    }

    Agregar(dni,nombre,correo,descripcion,nodo){
        if(nodo == null){
            return new NodoActor(dni,nombre,correo,descripcion)
        }else{
            if(dni < nodo.dni){
                nodo.izquierda = this.Agregar(dni,nombre,correo,descripcion, nodo.izquierda)
            }else if(dni > nodo.dni){
                nodo.derecha = this.Agregar(dni,nombre,correo,descripcion, nodo.derecha)
            }else{
            }
        }
        return nodo
    }

    preordenG(){
        this.pre_ordenG(this.raiz)
    }

    pre_ordenG(nodo){
        if(nodo != null){
            this.codigodot+= "\nnodo" + nodo.dni + "[shape=circle,style=\"filled\",fillcolor=\"#0CA1EB\",fontcolor=\"white\" label=\"Nombre:" + nodo.nombre + "\\nDNI:" + nodo.dni+ "\"];"
            if(nodo.izquierda != null){
                this.codigodot += "\nnodo" + nodo.dni + " -> nodo" + nodo.izquierda.dni + "[headport=n];"
            }
            if(nodo.derecha != null){
                this.codigodot += "\nnodo" + nodo.dni + " -> nodo" + nodo.derecha.dni + "[headport=n];"
            }
            this.pre_ordenG(nodo.izquierda)
            this.pre_ordenG(nodo.derecha)
        }
    }

    graficar(){
        this.codigodot = "digraph G{\nsplines=false;"
        this.preordenG()
        this.codigodot+="\n}"
        console.log(this.codigodot)
    }

    inorden(){
        this.in_orden(this.raiz)
    }

    in_orden(nodo){
        if(nodo!= null){
            this.in_orden(nodo.izquierda)
            console.log(nodo.dni)
            this.mostrar+=`
        <li>
            <span>
            <span class="name_user">${nodo.nombre}</span>
            <span class="msg_user"><strong>Correo:</strong> ${nodo.correo}</span><br><br>
            <span class="msg_user"><strong><strong>Descripción: </strong></strong>${nodo.descripcion}</span>
            <span class="time_ago">DNI: ${nodo.dni}</span>
            </span>
        </li>`
            this.in_orden(nodo.derecha)
        }
    }

    postorden(){
        this.post_orden(this.raiz)
    }
    post_orden(nodo){
        if(nodo!= null){
            this.post_orden(nodo.izquierda)
            this.post_orden(nodo.derecha)
            console.log(nodo.dni)
            this.mostrar+=`
        <li>
            <span>
            <span class="name_user">${nodo.nombre}</span>
            <span class="msg_user"><strong>Correo:</strong> ${nodo.correo}</span><br><br>
            <span class="msg_user"><strong><strong>Descripción: </strong></strong>${nodo.descripcion}</span>
            <span class="time_ago">DNI: ${nodo.dni}</span>
            </span>
        </li>`
        }
    }

    preorden(){
        this.pre_orden(this.raiz)
    }

    pre_orden(nodo){
        if(nodo!= null){
            console.log(nodo.dni)
            this.mostrar+=`
        <li>
            <span>
            <span class="name_user">${nodo.nombre}</span>
            <span class="msg_user"><strong>Correo:</strong> ${nodo.correo}</span><br><br>
            <span class="msg_user"><strong><strong>Descripción: </strong></strong>${nodo.descripcion}</span>
            <span class="time_ago">DNI: ${nodo.dni}</span>
            </span>
        </li>`
            this.pre_orden(nodo.izquierda)
            this.pre_orden(nodo.derecha)
        }
    }
}

//--------------------------------- CATEGORÍAS --------------------------------
class NodoIdHash{
    constructor(_id){
        this.id = _id
        this.categoria = null
        this.siguiente = null
        this.derecho = null
    }
}
class NodoCategoria{
    constructor(categoria){
        this.categoria = categoria
        this.derecho = null
    }
}

class TablaHash{
    constructor(){
        this.tamanio = 0
        this.cabeza = null
        this.llenos = 0
        this.mostrar = ""
        this.llenadoinicial()
    }

    llenadoinicial(){
        let contador = 0
        while(contador != 20){
            if(this.cabeza == null){
                this.cabeza = new NodoIdHash(contador)
                contador++
            }else{
                let temporal = this.cabeza
                while(temporal != null){
                    if(temporal.siguiente == null){
                        break
                    }
                    temporal = temporal.siguiente
                }
                temporal.siguiente = new NodoIdHash(contador)
                contador++
            }
            this.tamanio++
        }
    }
    
    insertar(categoria){
        let nuevo = new NodoCategoria(categoria)
        let posicion = categoria.id%this.tamanio
        let temporal = this.cabeza
        let maximo = this.tamanio*0.75
        console.log("LLENOS: " + this.llenos)
        console.log("CAPACIDAD MAX: " + maximo)
        console.log(categoria)
        if(this.llenos< maximo){
            while(temporal!= null){
                if(temporal.id == posicion){
                    if(temporal.categoria == null){
                        temporal.categoria = categoria
                        console.log(categoria)
                        break
                    }else{
                        if(temporal.derecho == null){
                            temporal.derecho = nuevo
                            console.log(categoria)
                        }else{
                            let tempo2 = temporal.derecho
                            while(tempo2 != null){
                                if(tempo2.categoria.id == nuevo.categoria.id){

                                    break
                                }
                                if(tempo2.derecho == null){
                                    break
                                }
                                tempo2 = tempo2.derecho
                            }
                            if(tempo2.categoria.id != nuevo.categoria.id){
                                console.log(categoria)
                                tempo2.derecho = nuevo
                            }
                        }
                        break
                    }
                }
                temporal = temporal.siguiente
            }
            this.llenos++
        }else{
            this.rehashing()
            this.insertar(categoria)
        }
    }
    
    rehashing(){
        let contador = this.tamanio
        let tope = this.tamanio+5
        while(contador != tope){
            let temporal = this.cabeza
            while(temporal != null){
                if(temporal.siguiente == null){
                    break
                }
                temporal = temporal.siguiente
            }
            temporal.siguiente = new NodoIdHash(contador)
            contador++
        }
        this.tamanio += 5
    }
    graficar(){
        let codigodot = "digraph G {\nrankdir=LR;\n node [shape=record width = 2.2 fontsize=30];"
        codigodot+= "\nides[style=\"filled\"  fillcolor=\"#3397EB\" label = \""
        let nodos = ""
        let temporal = this.cabeza
        let conexiones = ""
        while(temporal!= null){
            if(temporal.siguiente != null){
                if(temporal.categoria == null){
                    codigodot+= "<id" + temporal.id +"> |"
                    temporal = temporal.siguiente
                }else{
                    codigodot+= "<id" + temporal.id +">" + temporal.categoria.id+ "\\n" + temporal.categoria.company + " |"
                    temporal = temporal.siguiente
                }
            }else{
                if(temporal.categoria == null){
                    codigodot+= "<id" + temporal.id +">"
                    temporal = temporal.siguiente
                }else{
                    codigodot+= "<id" + temporal.id +">" + temporal.categoria.id+ "\\n" + temporal.categoria.company
                    temporal = temporal.siguiente
                }
            }
        }
        codigodot+= "\" height=" + this.tamanio + "];\nnode [shape=box fontsize=30];\n"
        let c = 0
        while(c != this.tamanio){
            codigodot+= "n" + c + "[shape=plain style=filled fillcolor=transparent fontsize=30 label=\"" + c + "\"];\n"
            codigodot+= "n" + c + "->ides:id" + c + "[color=transparent];\n"
            c++
        }
        temporal = this.cabeza
        while(temporal != null){
            if(temporal.derecho != null){
                let tempo2 = temporal.derecho
                while(tempo2 != null){
                    nodos+= "i" + temporal.id + "_" + tempo2.categoria.id + "[style=\"filled\" fontcolor=\"white\"  fillcolor=\"#B373AB\" label=\"ID:" + tempo2.categoria.id +"\\nCompany:"+ tempo2.categoria.company+ "\"];\n"
                    tempo2 = tempo2.derecho
                }
            }
            temporal = temporal.siguiente
        }
        temporal = this.cabeza
        while(temporal != null){
            if(temporal.derecho!= null){
                let tempo2 = temporal.derecho
                conexiones+= "ides:id" + temporal.id + "->" +"i"+ temporal.id + "_" + tempo2.categoria.id + ";\n"
                while(tempo2 != null){
                    if(tempo2.derecho != null){
                        conexiones+="i" +temporal.id + "_" + tempo2.categoria.id + "->" +"i" +temporal.id + "_" + tempo2.derecho.categoria.id + ";\n"
                    }
                    tempo2 = tempo2.derecho
                }
                
            }
            temporal = temporal.siguiente
        }
        codigodot += nodos + conexiones + "\n}"
        console.log(codigodot)
        return codigodot;

    }

    mostrarhtml(){
        let temporal = this.cabeza
        while(temporal != null){
            if(temporal.categoria != null){
                this.mostrar+=`
                <div class="col-sm-6">
                    <div class="card text-center">
                    <div class="card-body">
                        <h1 class="card-title">Categoria ID ${temporal.categoria.id}</h1>
                        <h5 class="card-text">Company: ${temporal.categoria.company}</h5>
                    </div>
                    </div><br>
                </div>`
                if(temporal.derecho != null){
                    let tempo2 = temporal.derecho
                    while(tempo2!= null){
                        this.mostrar+=`
                <div class="col-sm-6">
                    <div class="card text-center">
                    <div class="card-body">
                        <h1 class="card-title">Categoria ID ${temporal.categoria.id}</h1>
                        <h5 class="card-text">Company: ${temporal.categoria.company}</h5>
                    </div>
                    </div>
                </div><br>`
                        tempo2 = tempo2.derecho
                    }
                }
            }
            temporal = temporal.siguiente
        }
    }
}

class Categoria{
    constructor(_id,_company){
        this.id = _id
        this.company = _company
    }
}




//------------------------------- VARIABLES GLOBALES --------------------------
var actualUser = null;
var Users = new listUsers();
var Movies = new Arbol_AVL();
var Actores = new ArbolABB();
var Categorias = new TablaHash();


//-----------------Admin Auxiliar---------------------------------------
Users.addUser(2654568452521, "Oscar Armin", "EDD","admin@gmail.com" ,"123", 12345678, true);



//---------------------------------- LOGIN --------------------------------------
document.getElementById('btn_login').onclick=function(){
    console.log("Intento de Inicio de Sesión");
    var user = document.getElementById('userLogin').value;
    var password = document.getElementById('passwordLogin').value;
    var usuarioEntrada = Users.findUserLogin(user,password);
    if (usuarioEntrada != null){
       if(document.getElementById('checkAdm').checked == true && usuarioEntrada.admin == true){
            console.log("Intento de Inicio de Sesión Exitoso");
            actualUser = usuarioEntrada;
            alert("Ingreso como Administrador: " + usuarioEntrada.username);
            //document.getElementById('NavBar1').style.display="none";
            //document.getElementById('NavBar2').style.display="block";
            //document.getElementById('NavBar3').style.display="none";
            //document.getElementById('Index').style.display="none";
            document.getElementById('Login').style.display="none";
            //document.getElementById('Register').style.display="none";
            document.getElementById('Admin').style.display="block";
            //document.getElementById('User').style.display="none";

            //console.log("Comprobación")
            
            //document.getElementById("NarBar3").style.display="none";
            //document.getElementById("Administracion").style.display="block";
        }else if(document.getElementById('checkAdm').checked == true && usuarioEntrada.admin == false){
            alert("No posee permisos para ingresar como Administrador");
            document.getElementById("userLogin").value="";
            document.getElementById("passwordLogin").value="";
            console.log("Intento de Inicio de Sesión como Administrador Fallido");
       }else{
            alert("Ingreso de Usuario: " + usuarioEntrada.username);
            actualUser = usuarioEntrada;
            //document.getElementById('NavBar1').style.display="none";
            //document.getElementById('NavBar2').style.display="none";
            //document.getElementById('NavBar3').style.display="block";
            //document.getElementById('Index').style.display="none";
            //document.getElementById('Login').style.display="none";
            //document.getElementById('Register').style.display="none";
            //document.getElementById('Admin').style.display="none";
            //document.getElementById('User').style.display="block";
            //document.getElementById('MusicUser').style.display="none";
            //document.getElementById('PlaylistUser').style.display="none";
            //document.getElementById('ArtistUser').style.display="none";
            //document.getElementById('PodcastUser').style.display="none";
            //document.getElementById('FriendsUser').style.display="none";
            //document.getElementById('BlockUser').style.display="none";
            //document.getElementById("Login").style.display="none";
            //document.getElementById("Index").style.display="none";
            //document.getElementById("Administracion").style.display="none";
            //document.getElementById("PaginaUsuario").style.display="block";
            document.getElementById('welcome').innerHTML = "Hola " + actualUser.name;
            document.getElementById('bienvenida').style.display="block";
       }
    }else{
        alert("Usuario o contraseña incorrectos");
        console.log("Intento de Inicio de Sesión Fallido");
    }
    document.getElementById('userLogin').value = "";
    document.getElementById('passwordLogin').value = "";
    document.getElementById('checkAdm').checked = false;
    //listaUsuarios.graficarUsuarios();
}



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
       Users.addUser(datos[i].dpi, datos[i].nombre_completo, datos[i].nombre_usuario, datos[i].password, datos[i].correo, datos[i].contrasenia, datos[i].telefono, false);
    }

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
    var datos = JSON.parse(content);
    for (var i = 0; i < datos.length; i++) {
        Movies.insertar(datos[i].id_pelicula,datos[i].nombre_pelicula,datos[i].descripcion,datos[i].puntuacion_star,datos[i].precio_Q,datos[i].paginas, datos[i].categoria);
    }
    alert("Peliculas cargadas");
    //Movies.graficar();
    //Movies.inorden();
}

// ---- Carga Masiva Actores
document.getElementById('masivaActores').addEventListener('change', leerArchivoActores, false);
function leerArchivoActores(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
        var contenido = e.target.result;
        loadActores(contenido);
    };
    lector.readAsText(archivo);
}

function loadActores(content){
    var datos = JSON.parse(content);
    for (var i = 0; i < datos.length; i++) {
        Actores.insertar(datos[i].dni, datos[i].nombre_actor, datos[i].correo, datos[i].descripcion);
    }
    alert("Actores cargados");
}

// ---- Carga Masiva Categorías
document.getElementById('masivaCategorias').addEventListener('change', leerArchivoCategorias, false);
function leerArchivoCategorias(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
      return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
        var contenido = e.target.result;
        loadCategorias(contenido);
    };
    lector.readAsText(archivo);
}

function loadCategorias(content){
    var datos = JSON.parse(content);
    for (var i = 0; i < datos.length; i++) {
        var newCategoria = new Categoria(datos[i].id_categoria, datos[i].company);
        Categorias.insertar(newCategoria);

    }
    alert("Categorías cargadas");
}



//------------------- Gráficas Admin ------------------
document.getElementById('btn_UsuariosAdmin').onclick=function(){
    var grph = Users.grafica();
    d3.select("#graphUserAdmin").graphviz()
    .width(2000)
    .height(1050)
    .renderDot(grph)

    document.getElementById('UsuariosAdmin').style.display="block";
    document.getElementById('PeliculasAdmin').style.display="none";
    document.getElementById('ActoresAdmin').style.display="none";
    document.getElementById('CategoriasAdmin').style.display="none";
}

document.getElementById('btn_PeliculasAdmin').onclick=function(){
    var grph = Movies.graficar();
    d3.select("#graphPeliculaAdmin").graphviz()
    .width(2000)
    .height(1050)
    .renderDot(grph)

    document.getElementById('UsuariosAdmin').style.display="none";
    document.getElementById('PeliculasAdmin').style.display="block";
    document.getElementById('ActoresAdmin').style.display="none";
    document.getElementById('CategoriasAdmin').style.display="none";
}

document.getElementById('btn_ActoresAdmin').onclick=function(){
    Actores.graficar();
    var grph = Actores.codigodot;
    d3.select("#graphActorAdmin").graphviz()
    .width(2000)
    .height(1050)
    .renderDot(grph)

    document.getElementById('UsuariosAdmin').style.display="none";
    document.getElementById('PeliculasAdmin').style.display="none";
    document.getElementById('ActoresAdmin').style.display="block";
    document.getElementById('CategoriasAdmin').style.display="none";
}

document.getElementById('btn_CategoriasAdmin').onclick=function(){
    var grph = Categorias.graficar();
    d3.select("#graphCategoriaAdmin").graphviz()
    .width(2000)
    .height(1050)
    .renderDot(grph)

    document.getElementById('UsuariosAdmin').style.display="none";
    document.getElementById('PeliculasAdmin').style.display="none";
    document.getElementById('CategoriasAdmin').style.display="block";
    document.getElementById('ActoresAdmin').style.display="none";
}



document.getElementById("btn_graphUser").onclick=function(){
    html2canvas(document.querySelector("#graphUserAdmin")).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        var anchor = document.createElement('a');
        anchor.setAttribute('href', imgData);
        anchor.setAttribute('download', 'Users_ListaSimple.png');
        anchor.click();
        anchor.remove();
    });
}

document.getElementById("btn_graphPelicula").onclick=function(){
    html2canvas(document.querySelector("#graphPeliculaAdmin")).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        var anchor = document.createElement('a');
        anchor.setAttribute('href', imgData);
        anchor.setAttribute('download', 'Pelicula_AVL.png');
        anchor.click();
        anchor.remove();
    });
}

document.getElementById("btn_graphActor").onclick=function(){
    html2canvas(document.querySelector("#graphActorAdmin")).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        var anchor = document.createElement('a');
        anchor.setAttribute('href', imgData);
        anchor.setAttribute('download', 'Actor_ABB.png');
        anchor.click();
        anchor.remove();
    });
}

document.getElementById("btn_graphCategoria").onclick=function(){
    html2canvas(document.querySelector("#graphCategoriaAdmin")).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        var anchor = document.createElement('a');
        anchor.setAttribute('href', imgData);
        anchor.setAttribute('download', 'Categoria_TH.png');
        anchor.click();
        anchor.remove();
    });
}