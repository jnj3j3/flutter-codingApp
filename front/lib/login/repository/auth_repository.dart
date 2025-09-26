import 'dart:math';

import 'package:dio/dio.dart';
import 'package:flutter_application_1/login/utils/dio/dio.dart';
import 'package:flutter_application_1/login/utils/model/login_response.dart';
import 'package:flutter_application_1/login/utils/model/token_reponse.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final baseUrl = dotenv.env['BaseURL'];

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final dio = ref.watch(dioProvider);
  return AuthRepository(
    baseUrl: '$baseUrl/user',
    dio: dio,
  );
});

class AuthRepository {
  final String baseUrl;
  final Dio dio;
  AuthRepository({required this.baseUrl, required this.dio});
  Future<LoginResponse> login(
      {required String id, required String password}) async {
    final response = await dio
        .post('$baseUrl/login', data: {'id': id, 'password': password});
    return LoginResponse.fromJson(response.data);
  }

  Future<TokenResponse> token() async {
    final response = await dio.post(
      '$baseUrl/refreshToken',
      options: Options(headers: {
        'refreshToken': 'true',
      }),
    );
    return TokenResponse.fromJson(response.data);
  }
}
