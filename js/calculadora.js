window.onload = inicializar;

function inicializar() {
  if (localStorage.getItem('admin') == 'false' && localStorage.getItem('operario') == 'false') {
      window.location.href = "index.html";
  }

  if (localStorage.getItem('admin') == 'true') {
      document.getElementById('btn-usuarios').style.display= "inline";
  }

  var botonCerrarSesion = document.getElementById("btn-cerrarSesion");
  botonCerrarSesion.addEventListener("click" , logout, false);
}

function calcular() {
	var dosis = document.getElementById("dosis").value;
	var area = document.getElementById('area').value;

	var litros = (dosis*area)/1000;
	var cm3 = litros*1000;
	document.getElementById('litros').value = litros;
	document.getElementById('cm3').value = cm3;
}

//----------------------------- LOGOUT --------------------------------//
  function logout() {

    firebase.auth().signOut();
    localStorage.setItem("admin", "false");
    localStorage.setItem("operario", "false");
    window.location.href = "index.html";
  }
