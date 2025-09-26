import 'package:flutter/material.dart';

dynamic getIcon(String language) {
  switch (language) {
    case "cpp":
      return Image.asset('assets/icons/languages/cIcon.png');
    default:
      return const Icon(Icons.hide_image_outlined);
  }
}
