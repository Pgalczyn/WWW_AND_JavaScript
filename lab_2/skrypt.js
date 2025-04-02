function funkcja_zwrotna() {
    let formZ = document.forms["form1"];
    x = formZ.elements["pole_tekstowe"].value;
    x_type = typeof x;
    y = formZ.elements["pole_liczbowe"].value;
    y_type = typeof y;
    console.group("results");
    console.log(x + ":" + x_type);
    console.log(y + ":" + y_type);
    console.groupEnd();
}