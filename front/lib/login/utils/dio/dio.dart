import 'package:dio/dio.dart';
import 'package:flutter_application_1/login/provider/auth_provider.dart';
import 'package:flutter_application_1/login/utils/secure_storage/secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final baseUrl = dotenv.env['BaseURL'];

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio();
  final secureStorage = ref.watch(secureStorageProvider);
  dio.interceptors
      .add(CustomInterceptor(secureStorage: secureStorage, ref: ref));
  return dio;
});

class CustomInterceptor extends Interceptor {
  final Ref ref;
  final FlutterSecureStorage secureStorage;
  CustomInterceptor({required this.secureStorage, required this.ref});
  @override
  Future<void> onRequest(
      RequestOptions options, RequestInterceptorHandler handler) async {
    if (options.headers['accessToken'] == 'true') {
      options.headers.remove('accessToken');
      final token = await secureStorage.read(key: 'accessTokenKey');
      options.headers.addAll({
        'authorization': 'Bearer $token',
      });
    } else if (options.headers['refreshToken'] == 'true') {
      options.headers.remove('refreshToken');
      final refreshToken = await secureStorage.read(key: 'refreshTokenKey');
      final token = await secureStorage.read(key: 'accessTokenKey');
      options.headers
          .addAll({'authorization': 'Bearer $token', 'refresh': refreshToken});
    }
    super.onRequest(options, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    final String? refreshToken =
        await secureStorage.read(key: 'refreshTokenKey');
    final String? token = await secureStorage.read(key: 'accessTokenKey');
    if (refreshToken == null && token == null) {
      return handler.reject(err);
    }
    final isStatus401 = err.response?.statusCode == 401;
    final isPathRefresh = err.requestOptions.path == '/user/refreshToken';
    if (isStatus401 && !isPathRefresh) {
      final dio = Dio();
      try {
        final response = await dio.get('$baseUrl/user/refreshToken',
            options: Options(headers: {
              'authorization': 'Bearer $token',
              'refresh': '$refreshToken'
            }));
        final newAccessToken = response.data['accessToken'];
        final newRefreshToken = response.data['refreshToken'];
        final options = err.requestOptions;
        options.headers.addAll({'authorization': 'Bearer $newAccessToken'});
        await secureStorage.write(key: 'accessKeyToken', value: newAccessToken);
        await secureStorage.write(
            key: 'refreshTokenKey', value: newRefreshToken);
        final newResponse = await dio.fetch(options);
        return handler.resolve(newResponse);
      } on DioException catch (e) {
        ref.read(authProvider.notifier).lougout();
        return handler.reject(e);
      }
    }
    return handler.reject(err);
  }
}
