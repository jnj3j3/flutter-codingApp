import 'package:flutter/widgets.dart';
import 'package:flutter_application_1/login/model/user_model.dart';
import 'package:flutter_application_1/login/provider/user_me_provider.dart';
import 'package:flutter_application_1/utils/provider/router_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final authProvider = ChangeNotifierProvider((ref) => AuthNotifier(ref: ref));

class AuthNotifier extends ChangeNotifier {
  final Ref ref;
  AuthNotifier({required this.ref}) {
    ref.listen<UserModelBase?>(userMeProvider, (previous, next) {
      if (previous != next) {
        notifyListeners();
      }
    });
  }
  void lougout() {
    ref.read(userMeProvider.notifier).logout();
  }

  String? redirectLogin(BuildContext _, GoRouterState goState) {
    final user = ref.read(userMeProvider);
    final logginIn = goState.fullPath == '/login';
    if (user is UserModel) {
      switch (logginIn) {
        case true:
          return '/';
        case false:
          return null;
      }
    }
    if (user is UserModelError) {
      return logginIn ? null : '/login';
    }
    return null;
  }
}
