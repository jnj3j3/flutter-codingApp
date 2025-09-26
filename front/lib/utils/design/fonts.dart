import 'package:flutter/material.dart';

TextStyle textStyle(double fontSize) {
  // Add your code here
  return TextStyle(
    fontSize: fontSize,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    fontFamily: 'Picobla',
  );
}

TextStyle boldStyle(double fontSize) {
  return TextStyle(
    fontSize: fontSize,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  );
}

BoxDecoration boxDecoration() {
  return BoxDecoration(
    borderRadius: BorderRadius.circular(10),
    color: const Color.fromRGBO(24, 31, 41, 0.91),
  );
}

TextStyle purpleUnderLine(double fontSize) {
  return TextStyle(
      color: const Color(0xffA374DB),
      fontSize: fontSize,
      fontWeight: FontWeight.bold,
      decoration: TextDecoration.underline,
      decorationColor: const Color(0xffA374DB),
      decorationThickness: 2);
}

TextStyle redBoldStyle(double fontSize) {
  return TextStyle(
    fontSize: fontSize,
    fontWeight: FontWeight.bold,
    color: Colors.red,
  );
}
