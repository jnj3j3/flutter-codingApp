import 'package:flutter_application_1/login/provider/auth_provider.dart';
import 'package:flutter_application_1/login/view/login_page.dart';
import 'package:flutter_application_1/main.dart';
import 'package:flutter_application_1/utils/routes/routes.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final provider = ref.read(authProvider);
  return GoRouter(
      initialLocation: '/',
      routes: routes,
      refreshListenable: provider,
      redirect: provider.redirectLogin,
      debugLogDiagnostics: true);
});
