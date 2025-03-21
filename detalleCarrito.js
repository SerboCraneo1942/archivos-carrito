// variables globales
let tablaCarrito = document.querySelector(".cart-table tbody");
let resumenSubTotal = document.querySelector(".sub-total");
let resumenDescuento = document.querySelector(".promo");
let resumenTotal = document.querySelector(".total");
let destino = document.querySelector(".destino");
let resumenDomicilio = document.querySelector(".valor-domi");
let btnResumen = document.querySelector(".btn-resumen");
//Agregar evento al navegador
document.addEventListener("DOMContentLoaded" ,()=>{
    cargarProductos();
})

//funcion cargar productos guardados en localStore
function cargarProductos(){
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios !=null){
        todosProductos = Object.values(productosPrevios);  
    } 
    
     //limpiar tabla
     tablaCarrito.innerHTML = "";


     //comprobar si hay productos en localStorage
     if(todosProductos.length != 0){
            todosProductos.forEach((producto, i)=>{

             //cargar tabla   
                let fila = document.createElement("tr");
            fila.innerHTML=`
            <td class="d-flex justify-content-evenly align-items-center"> 
               <span onclick="borrarProducto(${i})" class="btn btn-danger"> x </span>
               <img src="${producto.imagen}" width="70px"> 
               ${producto.nombre}  
            </td>
            <td>
            $<span> ${producto.precio} </span>
            </td>
            <td> 
                <div class="quantity quantity-wrap"> 
                  <div class="decrement" onclick="actualizarCantidad( ${i} ,-1 )"> <i class="fa-solid fa-minus"></i> </div>
                  <input class="number" type="text" name="quantity" value="${producto.cantidad || 1}" maxlength="2" size="1" readonly>
                  <div class="increment" onclick="actualizarCantidad( ${i}, 1 )"> <i class="fa-solid fa-plus"></i> </div>
                 </div>                 
            </td>
            <td> ${ (producto.precio  * producto.cantidad).toFixed(3)} </td>
            `;
            tablaCarrito.appendChild(fila);
            });

        } else{
            let fila = document.createElement("tr");
             fila.innerHTML =`
             <td colspan="4"> 
               <p class="text-center fs-3"> no hay productos en el carrito </p>
             </td>
             `;
            tablaCarrito.appendChild(fila);

        }
        //ejecutar el resumen de compra
        resumenCompra();
}

//funcion para actualizar cantidades del producto
function actualizarCantidad(pos,cambio){
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios !=null){
        todosProductos = Object.values(productosPrevios);  
    } 

   

    if(todosProductos[pos]){
        //actualizar  cantidad
        todosProductos[pos].cantidad = (todosProductos[pos].cantidad || 1) + cambio;
        //asegurarse de que la cantidad no sea menor a 1
        if(todosProductos[pos].cantidad < 1){
            todosProductos[pos].cantidad = 1;
        }

        //calcular subtotal
        let subtotal = todosProductos[pos].precio * todosProductos[pos].cantidad;



    }
    //actualizart en localStorage
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));

    //recargar la tabla
    cargarProductos();

}

//funcion para borrar productos de detalle carrito
function borrarProducto(pos){
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios !=null){
        todosProductos = Object.values(productosPrevios);  
    } 
    //eliminar producto
    todosProductos.splice(pos, 1);
    //actualizar localStorage
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
    //recargar la tabla
    cargarProductos();
}

//funcion para el resumen de la compra
function resumenCompra(){
    let todosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let subtotal = 0; //acumular el subtotal de los productos
    //recorrer cada producto y acumulamos en el subtotal
    todosProductos.forEach((producto)=>{
        subtotal += producto.precio * producto.cantidad;
    });

     //calcular el valor del domicilio
     let domicilio = 0;
     switch (destino.value) {
        case "Medellin": default: domicilio; break;
        case "Bello": domicilio = 10.000; break;
        case "Copacabana": case "Caldas": case "La Estrella": domicilio = 20.000; break;
        case "Envigado": case "Itagui": case "Sabaneta": domicilio = 15.000; break;
        
     }

    //calcular descuento del 10% si la compra es mayor a 100 mil
    let descuento = (subtotal > 100.000) ? subtotal * 0.1 : 0;
    
    //calcular el total a pagar de la compra
    let totalApagar = subtotal - descuento + domicilio;

   

    /* console.log(domicilio) */
    //mostrar  los calculos de resumen de compra
    resumenSubTotal.textContent = subtotal.toFixed(3);
    resumenDescuento.textContent = descuento.toFixed(3);
    resumenTotal.textContent = totalApagar.toFixed(3);
    resumenDomicilio.textContent = domicilio.toFixed(3);
}
//agregar evento al destino para calcular el valor del domicilio
destino.addEventListener("change", ()=>{
    //actualizeel resumen de la compra
    resumenCompra();

});

//evento al boton pagar para guardar el resumen de la compra en localStorage
btnResumen.addEventListener("click", ()=>{
    //extraer los productos de localStorage
    let todosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let resumen = {
        //copiar todos los productos
        "todosProductos" : todosProductos,   
    }
    //llenar la variable resumen con la informacion el resumen de lal compra
    resumen.subtotal = resumenSubTotal.textContent;
    resumen.descuento = resumenDescuento.textContent;
    resumen.destino = destino.value;
    resumen.domicilio = resumenDomicilio.textContent;
    resumen.totalApagar = resumenTotal.textContent;


    //guardar el resumen de la compra en localStorage
    localStorage.setItem("pro-resumen" , JSON.stringify(resumen));

    //redirigir el usuario a la pagina de pago
    location.href = "checkout.html";



    console.log(resumen);

});