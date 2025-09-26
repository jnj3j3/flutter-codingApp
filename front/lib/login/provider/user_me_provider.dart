import 'dart:convert';

import 'package:flutter_application_1/login/model/user_model.dart';
import 'package:flutter_application_1/login/repository/UserMeRepository.dart';
import 'package:flutter_application_1/login/repository/auth_repository.dart';
import 'package:flutter_application_1/login/utils/secure_storage/secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_application_1/main.dart' as main;

class UserStateNotifier extends StateNotifier<UserModelBase?> {
  final AuthRepository authRepository;
  final UserMeRepository userMeRepository;
  final FlutterSecureStorage secureStorage;
  UserStateNotifier(
      {required this.authRepository,
      required this.userMeRepository,
      required this.secureStorage})
      : super(NotLoggedIn());
  Future<UserModelBase> login({
    required String id,
    required String password,
  }) async {
    try {
      state = UserModelLoading();
      final response = await authRepository.login(id: id, password: password);
      await secureStorage.write(
          key: 'accessTokenKey', value: response.accessToken);
      await secureStorage.write(
          key: 'refreshToeknKey', value: response.refreshToken);
      final userResponse = await userMeRepository.getMe();
      final token = await main.getMyDeviceToken() ?? '';
      await userMeRepository.createFCM(token);
      state = userResponse;
      return userResponse;
    } catch (err) {
      print(err);
      print("----------------------------------------------------------------");
      state = UserModelError(message: 'login failed:$err');
      return Future.value(state);
    }
  }

  Future<void> logout() async {
    state = null;
    await Future.wait([
      secureStorage.delete(key: 'accessTokenKey'),
      secureStorage.delete(key: 'refreshTokenKey'),
    ]);
  }
}

final userMeProvider =
    StateNotifierProvider<UserStateNotifier, UserModelBase?>((ref) {
  final authRepository = ref.watch(authRepositoryProvider);
  final userMeRepository = ref.watch(userMeRepositoryProvider);
  final secureStorage = ref.watch(secureStorageProvider);
  return UserStateNotifier(
    authRepository: authRepository,
    userMeRepository: userMeRepository,
    secureStorage: secureStorage,
  );
});
