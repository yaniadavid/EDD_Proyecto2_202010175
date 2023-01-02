var time = new Date();
console.log(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());

//-------------------------------- SHA 256 ---------------------------
var Sha256 = {};  // Sha256 namespace

/**
 * Generates SHA-256 hash of string
 *
 * @param {String} msg                String to be hashed
 * @param {Boolean} [utf8encode=true] Encode msg as UTF-8 before generating hash
 * @returns {String}                  Hash of msg as hex character string
 */
Sha256.hash = function(msg, utf8encode) {
    utf8encode =  (typeof utf8encode == 'undefined') ? true : utf8encode;
    
    // convert string to UTF-8, as SHA only deals with byte-streams
    if (utf8encode) msg = Utf8.encode(msg);
    
    // constants [§4.2.2]
    var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
             0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
             0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
             0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
             0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
             0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
             0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
             0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    // initial hash value [§5.3.1]
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

    // PREPROCESSING 
 
    msg += String.fromCharCode(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

    // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
    var l = msg.length/4 + 2;  // length (in 32-bit integers) of msg + ‘1’ + appended length
    var N = Math.ceil(l/16);   // number of 16-integer-blocks required to hold 'l' ints
    var M = new Array(N);

    for (var i=0; i<N; i++) {
        M[i] = new Array(16);
        for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
            M[i][j] = (msg.charCodeAt(i*64+j*4)<<24) | (msg.charCodeAt(i*64+j*4+1)<<16) | 
                      (msg.charCodeAt(i*64+j*4+2)<<8) | (msg.charCodeAt(i*64+j*4+3));
        } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
    }
    // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
    // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
    // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
    M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14])
    M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;


    // HASH COMPUTATION [§6.1.2]

    var W = new Array(64); var a, b, c, d, e, f, g, h;
    for (var i=0; i<N; i++) {

        // 1 - prepare message schedule 'W'
        for (var t=0;  t<16; t++) W[t] = M[i][t];
        for (var t=16; t<64; t++) W[t] = (Sha256.sigma1(W[t-2]) + W[t-7] + Sha256.sigma0(W[t-15]) + W[t-16]) & 0xffffffff;

        // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
        a = H[0]; b = H[1]; c = H[2]; d = H[3]; e = H[4]; f = H[5]; g = H[6]; h = H[7];

        // 3 - main loop (note 'addition modulo 2^32')
        for (var t=0; t<64; t++) {
            var T1 = h + Sha256.Sigma1(e) + Sha256.Ch(e, f, g) + K[t] + W[t];
            var T2 = Sha256.Sigma0(a) + Sha256.Maj(a, b, c);
            h = g;
            g = f;
            f = e;
            e = (d + T1) & 0xffffffff;
            d = c;
            c = b;
            b = a;
            a = (T1 + T2) & 0xffffffff;
        }
         // 4 - compute the new intermediate hash value (note 'addition modulo 2^32')
        H[0] = (H[0]+a) & 0xffffffff;
        H[1] = (H[1]+b) & 0xffffffff; 
        H[2] = (H[2]+c) & 0xffffffff; 
        H[3] = (H[3]+d) & 0xffffffff; 
        H[4] = (H[4]+e) & 0xffffffff;
        H[5] = (H[5]+f) & 0xffffffff;
        H[6] = (H[6]+g) & 0xffffffff; 
        H[7] = (H[7]+h) & 0xffffffff; 
    }

    return Sha256.toHexStr(H[0]) + Sha256.toHexStr(H[1]) + Sha256.toHexStr(H[2]) + Sha256.toHexStr(H[3]) + 
           Sha256.toHexStr(H[4]) + Sha256.toHexStr(H[5]) + Sha256.toHexStr(H[6]) + Sha256.toHexStr(H[7]);
}

Sha256.ROTR = function(n, x) { return (x >>> n) | (x << (32-n)); }
Sha256.Sigma0 = function(x) { return Sha256.ROTR(2,  x) ^ Sha256.ROTR(13, x) ^ Sha256.ROTR(22, x); }
Sha256.Sigma1 = function(x) { return Sha256.ROTR(6,  x) ^ Sha256.ROTR(11, x) ^ Sha256.ROTR(25, x); }
Sha256.sigma0 = function(x) { return Sha256.ROTR(7,  x) ^ Sha256.ROTR(18, x) ^ (x>>>3);  }
Sha256.sigma1 = function(x) { return Sha256.ROTR(17, x) ^ Sha256.ROTR(19, x) ^ (x>>>10); }
Sha256.Ch = function(x, y, z)  { return (x & y) ^ (~x & z); }
Sha256.Maj = function(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); }

//
// hexadecimal representation of a number 
//   (note toString(16) is implementation-dependant, and  
//   in IE returns signed numbers when used on full words)
//
Sha256.toHexStr = function(n) {
  var s="", v;
  for (var i=7; i>=0; i--) { v = (n>>>(i*4)) & 0xf; s += v.toString(16); }
  return s;
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
/*              single-byte character encoding (c) Chris Veness 2002-2010                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Utf8 = {};  // Utf8 namespace

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
Utf8.encode = function(strUni) {
  // use regular expressions & String.replace callback function for better efficiency 
  // than procedural approaches
  var strUtf = strUni.replace(
      /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  strUtf = strUtf.replace(
      /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0); 
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return strUtf;
}

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
Utf8.decode = function(strUtf) {
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  var strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f); 
        return String.fromCharCode(cc); }
    );
  strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
        return String.fromCharCode(cc); }
    );
  return strUni;
} 


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
        this.comentarios = "";
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
               'node [ style=filled ];\n'+
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
            nodo.derecho = this.insertarNodo(nodo.derecho,id_pelicula,nombre_pelicula,descripcion,puntuacion_star,precio_Q, paginas, categoria);
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
        var res =document.querySelector("#listadoPeliculas");
        res.innerHTML = "";
        this.inordenAux(this.raiz,res);
    }
    inordenAux(nodo,res){
        var respuesta = res;
        if(nodo != null){
            //id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria
            this.inordenAux(nodo.izquierdo,respuesta);
            console.log(nodo.nombre_pelicula + " " + nodo.id_pelicula + " " + nodo.puntuacion_star)
            respuesta.innerHTML += `
                    <div class="card">
                        <div class="card-header">
                          #${nodo.id_pelicula}
                        </div>
                        <div class="card-body">
                          <h5 class="card-title">${nodo.nombre_pelicula}</h5>
                          <p class="card-text">${nodo.descripcion}</p>
                          <p class="card-text">Q${nodo.precio_Q}</p>
                          <button class="btn btn-info btn-lg" style="display: flex;width: 40%;justify-content: right;" onclick="verPelicula('${nodo.id_pelicula}')">Ver Película</button>
                          <br><button class="btn btn-success btn-lg " style="display: flex;width: 40%;justify-content: right;" onclick="alquilarPelicula('${nodo.id_pelicula}')">Alquilar</button>
                        </div>
                    </div><br>`;

            this.inordenAux(nodo.derecho,respuesta);
        }
    }
    descendente(){
        var res =document.querySelector("#listadoPeliculas");
        res.innerHTML = "";
        this.desAux(this.raiz,res);
    }
    desAux(nodo,res){
        var respuesta = res;
        if(nodo != null){
            this.desAux(nodo.derecho,respuesta);
            respuesta.innerHTML += `
                    <div class="card">
                        <div class="card-header">
                          #${nodo.id_pelicula}
                        </div>
                        <div class="card-body">
                          <h5 class="card-title">${nodo.nombre_pelicula}</h5>
                          <p class="card-text">${nodo.descripcion}</p>
                          <p class="card-text">Q${nodo.precio_Q}</p>
                          <button class="btn btn-info btn-lg" style="display: flex;width: 40%;justify-content: right;" onclick="verPelicula('${nodo.id_pelicula}')">Ver Película</button>
                          <br><button class="btn btn-success btn-lg " style="display: flex;width: 40%;justify-content: right;" onclick="alquilarPelicula('${nodo.id_pelicula}')">Alquilar</button>
                        </div>
                    </div><br>`;

            this.desAux(nodo.izquierdo,respuesta);
        }
    }

    buscar(nodo,id){
        if(nodo == null){
            return null
        }else{
            if(nodo.id_pelicula == id){
                return nodo
            }else if(id < nodo.id_pelicula){
                return this.buscar(nodo.izquierdo,id)
            }else if(id > nodo.id_pelicula){
                return this.buscar(nodo.derecho,id)
            }
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
            this.codigodot+= "\nnodo" + nodo.dni + "[shape=circle,style=\"filled\", label=\"Nombre:" + nodo.nombre + "\\nDNI:" + nodo.dni+ "\"];"
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
            //console.log(nodo.dni)
            this.mostrar+=`
            <div class="card border-success mb-3" style="max-width: 55rem;">
            <div class="card-header">DNI: ${nodo.dni}</div>
            <div class="card-body text-success">
              <h5 class="card-title">${nodo.nombre}</h5>
              <p class="card-text">${nodo.descripcion}</p>
              <p class="card-text">Contacto: ${nodo.correo}</p>
            </div>
          </div>`
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
            //console.log(nodo.dni)
            this.mostrar+=`
            <div class="card border-success mb-3" style="max-width: 55rem;">
            <div class="card-header">DNI: ${nodo.dni}</div>
            <div class="card-body text-success">
              <h5 class="card-title">${nodo.nombre}</h5>
              <p class="card-text">${nodo.descripcion}</p>
              <p class="card-text">Contacto: ${nodo.correo}</p>
            </div>
          </div>`
        }
    }

    preorden(){
        this.pre_orden(this.raiz)
    }

    pre_orden(nodo){
        if(nodo!= null){
            //console.log(nodo.dni)
            this.mostrar+=`
            <div class="card border-success mb-3" style="max-width: 55rem;">
            <div class="card-header">DNI: ${nodo.dni}</div>
            <div class="card-body text-success">
              <h5 class="card-title">${nodo.nombre}</h5>
              <p class="card-text">${nodo.descripcion}</p>
              <p class="card-text">Contacto: ${nodo.correo}</p>
            </div>
          </div>`
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
                    <h1 class="card-title">${temporal.categoria.company}</h1>
                    <h5 class="card-text">ID: ${temporal.categoria.id}</h5>
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
                        <h1 class="card-title">${tempo2.categoria.company}</h1>
                        <h5 class="card-text">ID: ${tempo2.categoria.id}</h5>
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


//-------------------------------- BLOCKCHAIN -------------------------------
class NodoData {
    constructor(data, id) {
        this.data = data;
        this.id = id;
    }
}

class NodoHash {
    constructor(hash) {
        this.hash = hash;
        this.izquierdo = null;
        this.derecho = null;
    }
}


class Merkle {
    constructor() {
        this.topHash = null;
        this.dataBlock = [];
        this.index = 0;
        this.dot = "";
        this.count = 0;
    }

    add(data) {
        this.dataBlock.push(new NodoData(data, this.count));
        this.count++;
    }

    createTree(exponente) {
        this.topHash = new NodoHash(0);
        this._createTree(this.topHash, exponente);
    }


    _createTree(nodoHashTmp, exponente) {
        if (exponente > 0) {
            nodoHashTmp.izquierdo = new NodoHash(0);
            nodoHashTmp.derecho = new NodoHash(0);
            this._createTree(nodoHashTmp.izquierdo, exponente -1);
            this._createTree(nodoHashTmp.derecho, exponente - 1);
        }
    }

    generarHash(nodoHashTmp, n) {
        if (nodoHashTmp != null) {
            this.generarHash(nodoHashTmp.izquierdo, n);
            this.generarHash(nodoHashTmp.derecho, n);

            if (nodoHashTmp.izquierdo == null && nodoHashTmp.derecho == null) {
                let indice = n-(this.index);
                nodoHashTmp.izquierdo = this.dataBlock[indice];
                this.index --;
                nodoHashTmp.hash = Sha256.hash(nodoHashTmp.izquierdo.data);

            } else {
                nodoHashTmp.hash = Sha256.hash(nodoHashTmp.izquierdo.hash + nodoHashTmp.derecho.hash);
            }
        }

    }

    autenticacion() {
        let exponente = 1;
        
        while (Math.pow(2, exponente) < this.dataBlock.length) {
            exponente += 1;

        }

        let cantidadBloques = Math.pow(2, exponente);


        for (let i = this.dataBlock.length; i < cantidadBloques; i++) {
            let dataBalanceo = (i*100);
            this.dataBlock.push(new NodoData(String(dataBalanceo), this.count));
            this.count++;
        }

        this.index = cantidadBloques;
        this.createTree(exponente);
        this.generarHash(this.topHash, this.index);
    }


}

class Bloque {
    constructor(indice, data, previusHash, rootMerkle){
        this.indice = indice;
        this.data = data;
        this.timeStamp = this.calcularTimeStamp();
        this.previusHash = previusHash;
        this.hash = this.crearHash();
        this.nonce = 0;
        this.rootMerkle = rootMerkle;
      
        this.pruebaTrabajo(2);
    }

    calcularTimeStamp() {
        let today = new Date();
        let dia = String(today.getDate()).padStart(2, '0');
        let mes = String(today.getMonth() + 1).padStart(2, '0');
        let anio = today.getFullYear();
        let hora = today.toLocaleTimeString('en-US');
        let time = dia + '-' + mes + '-' + anio + "-::" + hora;
        return time;
    }
    
    pruebaTrabajo(dificultad) {
      while (this.hash.substring(0,dificultad) !== Array(dificultad+1).join("0")) {
        this.nonce++;
        this.hash = this.crearHash();
    
      }

      return this.hash;
    }

     crearHash() {
        return Sha256.hash(this.indice + this.timeStamp + this.previusHash + this.rootMerkle + this.nonce);
    }
}

class NodoBloque {
  constructor(bloque) {
    this.bloque = bloque;
    this.next = null;
  }
}

class ListaSimple {
  constructor() {
    this.head = null;
  }

  push(bloque) {
    let NodoBloque = new NodoBloque(bloque);
  }
}


class Cadena {
  constructor(){
    this.indice = 0;
    this.cadena = [];
  }

  bloqueInicio(data, rootMerkle) {
    let inicio = new Bloque(this.indice, data, "Bloque 0",  rootMerkle);
    this.cadena.push(inicio);
    this.indice++;
    
  }

  agregar(data, rootMerkle) {
    let nuevo = new Bloque(this.indice, data, this.cadena[this.indice-1].hash, rootMerkle);
    this.indice++;
    this.cadena.push(nuevo);
  }

  print() {
    for(let item of this.cadena){
      console.log(item);
    }
  }
  
  graficarBlockchain() {
    let conexiones = "";
        let nodos = ""
        let cadena = "digraph Blockchain{\nlabel = \"Blockchain\";\nnode [shape=box];\n";

        if (this.indice == 0) {
            
        } else {

            for (let i = 0; i < this.cadena.length; i++) {
                nodos += "N" + this.cadena[i].hash + '[label="Bloque: ' + i +' \nHash:' + this.cadena[i].hash + '\nPrev: ' + 
                this.cadena[i].previusHash + ' \nRoot Merkle: ' + this.cadena[i].rootMerkle + '\n' + this.cadena[i].data +
                '\n Fecha: ' + this.cadena[i].timeStamp + '"];\n';
                if (i != (this.cadena.length -1)) {
                    conexiones += "N" + this.cadena[i].hash + " -> " + "N" + this.cadena[i+1].hash+ ";\n";
                }
            }
        
            cadena += nodos + "{rank = same; " + conexiones + "\n}\n}";
            //console.log(cadena);

            d3.select("#grphBlockchain").graphviz()
                .width(1000)
                .height(1050)
                .renderDot(cadena);
        }
  }

}


//------------------------------- VARIABLES GLOBALES --------------------------
var actualUser = null;
var Users = new listUsers();
var Movies = new Arbol_AVL();
var Actores = new ArbolABB();
var Categorias = new TablaHash();
var merkle = new Merkle();
var timer = 30000;
var transacciones = "Transacciones[/n";
var cadenaBloques = new Cadena();
var peliAlquiladas = [];


//-----------------Admin Auxiliar---------------------------------------
Users.addUser(2654568452521, "Oscar Armin", "EDD","admin@gmail.com" ,"123", 12345678, true);



//------------------------------------ BC --------------------------------
document.addEventListener('DOMContentLoaded', function() {
    setInterval(crearNuevoBloque, timer);
});

function crearNuevoBloque() {
    if (cadenaBloques.indice == 0) {
        merkle.autenticacion();
        cadenaBloques.bloqueInicio(transacciones, merkle.topHash.hash);
    } else {
        merkle.autenticacion();
        transacciones += "]"; 
        cadenaBloques.agregar(transacciones, merkle.topHash.hash);
    }
    cadenaBloques.graficarBlockchain();
    transacciones = "Transacciones[\n";
    console.log('Nuevo Bloque - ' + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
}

document.getElementById('btn_Timer').onclick=function(){
    timer = parseInt(document.getElementById('inputTime').value) * 1000;
    document.getElementById('inputTime').value = "";
    console.log(timer);
}
document.getElementById('btn_bloqueNuevo').onclick=function(){
    crearNuevoBloque();
}


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
            document.getElementById('NavBar1').style.display="none";
            document.getElementById('NavBarUser').style.display="none";
            document.getElementById('NavBarAdmin').style.display="block";
            document.getElementById('Login').style.display="none";
            document.getElementById('Admin').style.display="block";
            document.getElementById('Blockchain').style.display="none";
        }else if(document.getElementById('checkAdm').checked == true && usuarioEntrada.admin == false){
            alert("No posee permisos para ingresar como Administrador");
            document.getElementById("userLogin").value="";
            document.getElementById("passwordLogin").value="";
            console.log("Intento de Inicio de Sesión como Administrador Fallido");
       }else{
            alert("Ingreso de Usuario: " + usuarioEntrada.username);
            actualUser = usuarioEntrada;
            document.getElementById('NavBar1').style.display="none";
            document.getElementById('NavBarUser').style.display="block";
            document.getElementById('NavBarAdmin').style.display="none";
            document.getElementById('Login').style.display="none";
            document.getElementById('User').style.display="block";
            document.getElementById('VistaIndividual').style.display="none";
            document.getElementById('ActoresUsers').style.display="none";
            document.getElementById('CategoriasUsers').style.display="none";
            document.getElementById('welcome').innerHTML = "Hola " + actualUser.name;
            document.getElementById('bienvenida').style.display="block";
            document.getElementById('PeliculasUsers').style.display = "block";
            Movies.inorden();

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

document.getElementById('deslogin').onclick=function(){
    actualUser = null;
    document.getElementById('NavBar1').style.display="block";
    document.getElementById('Login').style.display="block";
    document.getElementById('Admin').style.display="none";
    document.getElementById('User').style.display="none";
    document.getElementById('Blockchain').style.display="none";
    document.getElementById('NavBarUser').style.display="none";
    document.getElementById('NavBarAdmin').style.display="none";
    document.getElementById('grphBlockchain').style.display="none";
}

document.getElementById('desloginUser').onclick=function(){
    actualUser = null;
    document.getElementById('NavBar1').style.display="block";
    document.getElementById('Login').style.display="block";
    document.getElementById('Admin').style.display="none";
    document.getElementById('User').style.display="none";
    document.getElementById('Blockchain').style.display="none";
    document.getElementById('NavBarUser').style.display="none";
    document.getElementById('NavBarAdmin').style.display="none";
    document.getElementById('grphBlockchain').style.display="none";
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
    //dpi, nombre_completo, nombre_usuario, correo, contrasenia, telefono, admin
    for (var i = 0; i < datos.length; i++) {
       Users.addUser(datos[i].dpi, datos[i].nombre_completo, datos[i].nombre_usuario, datos[i].correo, datos[i].contrasenia, datos[i].telefono, false);
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
        console.log(datos[i])
                        //id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q, paginas, categoria
        Movies.insertar(datos[i].id_pelicula, datos[i].nombre_pelicula, datos[i].descripcion, datos[i].puntuacion_star, datos[i].precio_Q, datos[i].paginas, datos[i].categoria);
        
    }
    console.log(Movies)
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

document.getElementById('btn_cargaMasiva').onclick=function(){
    document.getElementById('Admin').style.display="block";
    document.getElementById('Blockchain').style.display="none";
    document.getElementById('grphBlockchain').style.display="none";
}

document.getElementById('btn_blockchain').onclick=function(){
    document.getElementById('Admin').style.display="none";
    document.getElementById('Blockchain').style.display="block";
    document.getElementById('grphBlockchain').style.display="block";
}


//------------------- Gráficas Admin ------------------
document.getElementById('btn_UsuariosAdmin').onclick=function(){
    var grph = Users.grafica();
    d3.select("#graphUserAdmin").graphviz()
    .width(1000)
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
    .width(1000)
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
    .width(1000)
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
    .width(1000)
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



//-------------------------------------------- INTERFAZ USUARIO -----------------------------------------------
document.getElementById("btn_peliculas").onclick=function(){
    document.getElementById('PeliculasUsers').style.display="block";
    document.getElementById('VistaIndividual').style.display="none";
    document.getElementById('ActoresUsers').style.display="none";
    document.getElementById('CategoriasUsers').style.display="none";
}
document.getElementById("btn_actores").onclick=function(){
    document.getElementById('PeliculasUsers').style.display="none";
    document.getElementById('VistaIndividual').style.display="none";
    document.getElementById('ActoresUsers').style.display="block";
    document.getElementById('CategoriasUsers').style.display="none";
}
document.getElementById("btn_categorias").onclick=function(){
    document.getElementById('PeliculasUsers').style.display="none";
    document.getElementById('VistaIndividual').style.display="none";
    document.getElementById('ActoresUsers').style.display="none";
    document.getElementById('CategoriasUsers').style.display="block";
    Categorias.mostrarhtml();
    document.getElementById('tablitaCategorias').innerHTML = Categorias.mostrar;
}


document.getElementById("btn_PeliAsc").onclick=function(){
    Movies.inorden();
}

document.getElementById("btn_PeliDesc").onclick=function(){
    Movies.descendente();
}

function alquilarPelicula(id){
    var actualMovie = Movies.buscar(Movies.raiz, id);
    let dataPeli = actualUser.name + " - " + actualMovie.nombre_pelicula;
    peliAlquiladas.push(dataPeli);
    transacciones += "\t{" + actualUser.name + " - " + actualMovie.nombre_pelicula + " - " + actualMovie.precio_Q + "Q},\n";
    merkle.add(dataPeli);
}


function verPelicula(id){
    var actualMovie = Movies.buscar(Movies.raiz, id);
    var estrellas = "☆☆☆☆☆";
    switch(actualMovie.puntuacion_star){
        case 1:
            estrellas = "★☆☆☆☆";
            break;
        case 2:
            estrellas = "★★☆☆☆";
            break;
        case 3:
            estrellas = "★★★☆☆";
            break;
        case 4:
            estrellas = "★★★★☆";
            break;
        case 5:
            estrellas = "★★★★★";
            break;
    }
    document.getElementById('PeliculasUsers').style.display="none";
    document.getElementById('VistaIndividual').style.display="block";
    document.getElementById('CardVistaIndividual').innerHTML = `<div class="card" style="width: 50rem;">
            <img class="card-img-top" src="images/movie.jpg" style="width: 70%;margin: auto;" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${actualMovie.nombre_pelicula}</h5>
              <p class="card-text">${actualMovie.descripcion}</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">${estrellas}</li>
              <li class="list-group-item"><div class="row">
                <div class="col-md-3 col-md-offset-9 text-right" style="margin: auto;">
                    <div class="btn-group d-flex w-100" role="group">
                        <button class="btn btn-outline-primary btn-sm w-100" type="button" id="btn_sumarStar" onclick="restarEstrella('${actualMovie.id_pelicula}')"><span class="glyphicon glyphicon-step-backward"></span>&nbsp;-</button>
                        <button class="btn btn-outline-primary btn-sm w-100" type="button" id="btn_restarStar" onclick="sumarEstrella('${actualMovie.id_pelicula}')">+&nbsp;<span class="glyphicon glyphicon-step-forward"></span></button>
                    </div>
                </div>
            </div></li>
              <li class="list-group-item">Precio: Q${actualMovie.precio_Q}</li>
            </ul>
            <div class="card-body">
              <button class="card-link" onclick="alquilarPelicula('${actualMovie.id_pelicula}')">Alquilar</button>
            </div>
        </div> <br><br>`;
        document.getElementById('agregarComment').innerHTML = `<div class="form-group row">
            <label for="inputEmail3" class="col-sm-2 col-form-label">Dejar un comentario</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="inputComment" placeholder="Comentario...">
            </div>
        </div>
        <button id="btn_comentar" class="btn btn-outline-info" style="width: 40%;margin: auto;" onclick="agregarComment(${id})">Comentar</button>`
        if(actualMovie.comentarios != ""){
            document.getElementById('listadoComments').innerHTML = actualMovie.comentarios;
        }

}

function restarEstrella(id){
    var actualMovie = Movies.buscar(Movies.raiz, id);
    if(actualMovie.puntuacion_star === 0){
        verPelicula(id);
    }else{
    actualMovie.puntuacion_star--;
    verPelicula(id);
    }
}

function sumarEstrella(id){
    var actualMovie = Movies.buscar(Movies.raiz, id);
    if(actualMovie.puntuacion_star === 5){
        verPelicula(id);
    }else{
        actualMovie.puntuacion_star++;
        verPelicula(id);
    }
}

function agregarComment(id){
    var actualMovie = Movies.buscar(Movies.raiz, id);
    var texto = document.getElementById('inputComment').value;

    actualMovie.comentarios += `<div class="card">
        <div class="card-body" >
            <b>${actualUser.username}:</b> ${texto}
        </div>
        </div>`;

        verPelicula(id);
}


document.getElementById("btn_inOrden").onclick=function(){
    Actores.mostrar=""
    Actores.inorden();
    document.getElementById('listadoActores').innerHTML = Actores.mostrar;
}

document.getElementById("btn_preOrden").onclick=function(){
    Actores.mostrar=""
    Actores.preorden();
    document.getElementById('listadoActores').innerHTML = Actores.mostrar;
}

document.getElementById("btn_postOrden").onclick=function(){
    Actores.mostrar=""
    Actores.postorden();
    document.getElementById('listadoActores').innerHTML = Actores.mostrar;
}




