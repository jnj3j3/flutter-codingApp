import 'package:dio/dio.dart';
import 'package:flutter_application_1/login/model/user_model.dart';
import 'package:flutter_application_1/question/board/model/answer_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

final baseUrl = dotenv.env['BaseURL'];

Future<bool> checkAnswerLike(
    Answer answer, UserModel userState, Dio dio) async {
  final response = await dio.get(
    '$baseUrl/answer_like/checkAnswer_like/${answer.id}',
    options: Options(headers: {
      'accessToken': 'true',
    }),
  );
  if (response.statusCode == 200) {
    return response.data;
  } else {
    return false;
  }
}

Future<dynamic> likeAnswer(Answer answer, Dio dio) async {
  return await dio.post('$baseUrl/answer_like/createAnswer_like',
      data: {'answerId': answer.id},
      options: Options(headers: {
        'accessToken': 'true',
      }));
}

Future<dynamic> dislikeAnswer(Answer answer, Dio dio) async {
  return await dio.delete('$baseUrl/answer_like/deleteAnswer_like',
      data: {'answerId': answer.id},
      options: Options(headers: {
        'accessToken': 'true',
      }));
}
