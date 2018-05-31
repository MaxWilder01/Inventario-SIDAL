  //------------------------------- WINDOW ON LOAD ----------------------------------//

  window.onload = inicializar;

  //-------------------------------- VARIABLES -------------------------------------//

  var formDatos, refDatos, tBodyTablaDatos, modal, botonCerrarModal,
      botonAgregar, botonSubmit, CREAR, ACTUALIZAR, modo, botonPDF;

  //------------------------------- INICIALIZAR -----------------------------------//

  function inicializar() {
    modal            = document.getElementById('modal');
    formDatos        = document.getElementById("form-datos");
    tBodyTablaDatos  = document.getElementById("tbody-tabla-datos");
    botonAgregar     = document.getElementById("btn-agregar");
    botonSubmit      = document.getElementById("btn-enviar");
    botonPDF         = document.getElementById("btn-pdf");
    botonCerrarModal = document.getElementsByClassName("close")[0];

    formDatos        .addEventListener("submit", enviarDatosFirebase, false);
    botonCerrarModal .addEventListener("click" , cerrarModal        , false);
    botonAgregar     .addEventListener("click" , mostrarModal       , false);
    botonPDF         .addEventListener("click" , generarPDF         , false);

    CREAR            = "CREAR";
    ACTUALIZAR       = "ACTUALIZAR";
    modo             =  CREAR;

    window.onclick   = cerrarModalAlClickAfuera;
    refDatos         = firebase.database().ref().child("datos");
  }

  //----------------------- CERRAR MODAL AL CLICK AFUERA --------------------------//

  function cerrarModalAlClickAfuera (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById("form-datos").reset();
    }
  }

  //------------------------------ MOSTRAR MODAL ----------------------------------//

  function mostrarModal() {
    botonSubmit.value = (modo == "CREAR") ? "Enviar" : "Actualizar";
    modal.style.display = "block";
  }

  //------------------------------ CERRAR MODAL ----------------------------------//

  function cerrarModal(event) {
    modal.style.display = "none";
    modo = "CREAR";
    document.getElementById("form-datos").reset();
  }

  //-------------------------- ENVIAR DATOS FIREBASE -----------------------------//

  function enviarDatosFirebase(event) {
    event.preventDefault();

    var nombre   = event.target.nombre.value;
    var sector   = event.target.sector.value;
    var cantidad = event.target.cantidad.value;
    var valor    = event.target.valor.value;

    if (nombre == "" || sector == "" || cantidad == "" || valor == "") {
      alertify.set('notifier','position', 'top-center');
      alertify.error('Todos los campos son obligatorios', 3);
      return;
    }

    if (isNaN(cantidad)) {
      alertify.set('notifier','position', 'top-center');
      alertify.error('Cantidad: Sólo se admiten valores numéricos', 3);
      return;
    }

    if (isNaN(valor)) {
      alertify.set('notifier','position', 'top-center');
      alertify.error('Valor: Sólo se admiten valores numéricos', 3);
      return;
    }

    switch (modo) {
      case CREAR:
        refDatos.push({
          nombre: nombre,
          sector: sector,
          cantidad: cantidad,
          valor: valor
        } ,function (error) {
          if (error){
            alertify.set('notifier','position', 'bottom-right');
            alertify.error("ERROR: No se pudo agregar el producto", 2);
          }
          else{
            alertify.set('notifier','position', 'bottom-right');
            alertify.success("Agregado con éxito", 2);
          }
        });

        verificarConexion();

        break;
      case ACTUALIZAR:
        refDatoEditar.update({
          nombre: nombre,
          sector: sector,
          cantidad: cantidad,
          valor: valor
        });
        modo = CREAR;
      break;
    }
    formDatos.reset();
    cerrarModal()
  }

  //------------------------------ EDITAR DATO ----------------------------------//

  function editarDato() {
    var keyDatoEditar = this.getAttribute("data");
    refDatoEditar = refDatos.child(keyDatoEditar);

    refDatoEditar.once("value", function (snap) {
      var datos = snap.val();
      document.getElementById("nombre").value = datos.nombre;
      document.getElementById("sector").value = datos.sector;
      document.getElementById("cantidad").value = datos.cantidad;
      document.getElementById("valor").value  = datos.valor;
    });

    modo = ACTUALIZAR;
    mostrarModal();
  }

  //------------------------------ BORRAR DATO ---------------------------------//

  function borrarDato() {
    var keyDatoBorrar = this.getAttribute("data");
    var refDatoBorrar = refDatos.child(keyDatoBorrar);
    refDatoBorrar.remove();

    var table = $('#tabla-datos').DataTable();
    table
      .row( $(this).parents('tr') )
      .remove()
      .draw(false);
  }

  //--------------------------- VERIFICAR CONEXIÓN ------------------------------//

  function verificarConexion() {
    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", function(snap) {
      if (snap.val() === false) {
        alertify.set('notifier','position', 'bottom-right');
        alertify.error('ERROR: No hay conexión con base de datos', 2);
      }
    });
  }

  //----------------------------- GENERAR PDF --------------------------------//
  //TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO//

  function generarPDF() {
    var doc = new jsPDF();
    doc.fromHTML($('#tabla-datos').get(0), 20, 20, {width: 500});
    doc.save('Hola.pdf');
  }
