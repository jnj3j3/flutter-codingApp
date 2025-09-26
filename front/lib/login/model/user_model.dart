abstract class UserModelBase {}

class UserModel extends UserModelBase {
  final String no;
  final String nickname;
  UserModel({
    required this.no,
    required this.nickname,
  });
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      no: json['no'].toString(),
      nickname: json['nickname'],
    );
  }
}

class UserModelError extends UserModelBase {
  final String message;
  UserModelError({
    required this.message,
  });
}

class UserModelLoading extends UserModelBase {}

class NotLoggedIn extends UserModelBase {}
