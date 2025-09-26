import 'dart:async';

import 'package:dio/dio.dart' hide Headers;
import 'package:flutter/widgets.dart';
import 'package:flutter_application_1/login/model/user_model.dart';
import 'package:flutter_application_1/login/utils/dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:retrofit/retrofit.dart';

final baseUrl = dotenv.env['BaseURL'];

final userMeRepositoryProvider = Provider<UserMeRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return UserMeRepository(
    dio: dio,
    baseUrl: '$baseUrl',
  );
});

class UserMeRepository {
  final Dio dio;
  final String baseUrl;
  UserMeRepository({required this.dio, required this.baseUrl});

  Future<UserModel> getMe() async {
    try {
      final response = await dio.get('$baseUrl/user/checkToken',
          options: Options(headers: {'accessToken': 'true'}));
      return UserModel.fromJson(response.data);
    } catch (err) {
      throw Exception('Failed to get user info $err');
    }
  }

  @POST('/fcm/createFCM')
  @Headers({'accessToken': 'true', 'Accept': 'application / json'})
  Future<dynamic> createFCM(String token) {
    try {
      return dio.post('$baseUrl/fcm/createFCM',
          data: {'token': token},
          options: Options(headers: {'accessToken': 'true'}));
    } catch (err) {
      throw Exception('Failed to create FCM $err');
    }
  }
}
