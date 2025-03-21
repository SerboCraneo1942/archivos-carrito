//Declarar variables
let btnProducts = document.querySelectorAll(".btn-product"); //para varias etiquetas
let contadorCarrito = document.querySelector(".contar-pro"); //para una sola etiqueta,las clases se les pone el .(punto)
let listadoCarrito = document.querySelector(".list-cart  tbody");
let con = 0;
document.addEventListener("DOMContentLoaded",()=>{
    cargarProLocalstorage();
})



btnProducts.forEach((btn, i)=>{
    btn.addEventListener("click", ()=>{
        //alert("diste click al boton" + (i+1));
        //contador de productos en el carrito
        con++;
        contadorCarrito.textContent = con;
        //agregar producto al carrito
        infoProducto(i);
    })
})

//agregar productos al carrito
function agregarProducto(producto){
    let fila = document.createElement("tr");
    fila.innerHTML=`
    <td>  </td>
    <td> <img src="${producto.imagen}" width="70px"> </td>
    <td> ${producto.nombre} </td>
    <td> $${producto.precio} </td>
    <td> <span onclick="borrarProducto(${con})" class="btn btn-danger"> x </span> </td>
    `;
    listadoCarrito.appendChild(fila);
    actualizarNumeracionCarrito();
}





//agregue este
// Función para actualizar el número de orden en el carrito
function actualizarNumeracionCarrito() {
    let filas = listadoCarrito.querySelectorAll("tr");
    filas.forEach((fila, index) => {
        fila.children[0].textContent = index + 1; // Asigna el número en orden
    });
    contadorCarrito.textContent = filas.length; // Actualiza el contador de productos
}







//funncion para agregar la infortmacion del producto al carrito
function infoProducto(pos){
    let producto = btnProducts[pos].parentElement.parentElement.parentElement;
    let infoPro={
        nombre: producto.querySelector("h3").textContent,
        imagen: producto.querySelector("img").src,
        precio: producto.querySelector("h5").textContent.split("$")[1],
        cantidad: 1
    }

    //console.log(infoPro);
    agregarProducto(infoPro);
    guardarProLocalstorage(infoPro);

}

//funcion para quitar un producto del carrito
function borrarProducto(pos){
   let producto = event.target;
   //console.log(producto);
   producto.parentElement.parentElement.remove();
   //disminuir el contador de productos en el carrito
   if(con > 0){
    con--;
    contadorCarrito.textContent = con;
   }
   actualizarNumeracionCarrito();
   eliminarProLocalstorage(pos);
}
// guardar los productos en localStorage
function guardarProLocalstorage(producto){
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios !=null){
        todosProductos = Object.values(productosPrevios);  
    } 
    todosProductos.push(producto);
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
}

//eliminar producto de localStorage

function eliminarProLocalstorage(pos){
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios !=null){
        todosProductos = Object.values(productosPrevios);  
    }
    todosProductos.splice((pos-1),1);//borrar 
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos)); //guardar en localStorage los productos que quedan

}

//cargar productos del localStorage en el carrito
function cargarProLocalstorage(){
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios !=null){
        todosProductos = Object.values(productosPrevios);  
    }
    todosProductos.forEach((producto)=>{
        agregarProducto(producto);
    });
}

contadorCarrito.parentElement.addEventListener("click", ()=>{
    listadoCarrito.parentElement.classList.toggle("ocultar");
})