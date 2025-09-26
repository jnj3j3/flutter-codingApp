import 'package:dio/dio.dart';
import 'package:flutter_application_1/login/model/user_model.dart';
import 'package:flutter_application_1/question/board/model/answer_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

final baseUrl = dotenv.env['BaseURL'];

Future<dynamic> selectAnswer(Answer answer, String questionId, Dio dio) {
  return dio.patch('$baseUrl/answer/selectAnswer',
      data: {'answerId': answer.id, 'questionId': questionId},
      options: Options(headers: {
        'accessToken': 'true',
      }));
}
