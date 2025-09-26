import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

final baseUrl = dotenv.env['BaseURL'];

Future<dynamic> createFCM(String token, Dio dio) async {
  final response = await dio.post('$baseUrl/fcm/createFCM',
      data: {'token': token},
      options: Options(headers: {'accessToken': 'true'}));
  if (response.statusCode == 200) {
    return response;
  } else {
    return false;
  }
}
