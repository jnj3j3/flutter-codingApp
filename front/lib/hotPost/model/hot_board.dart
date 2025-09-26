import 'dart:ffi';

class HotBoard {
  final int id;
  final String title;
  final String language;
  final String code;
  final String created;
  final String userName;
  final int? codeJobsId;
  final int like;
  final int state;

  HotBoard({
    required this.id,
    required this.title,
    required this.language,
    required this.code,
    required this.created,
    required this.userName,
    required this.codeJobsId,
    required this.like,
    required this.state,
  });
  factory HotBoard.fromJson(Map<String, dynamic> json) {
    return HotBoard(
      id: json['id'],
      title: json['title'],
      language: json['language'],
      code: json['code'],
      created: json['created'],
      userName: json['user_id'],
      codeJobsId: json['code_jobs_id'],
      like: json['like'],
      state: json['state'],
    );
  }
}
