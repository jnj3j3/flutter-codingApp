class HotQuestion {
  final int id;
  final String title;
  final String content;
  final String userName;
  final String created;
  final int state;
  final int isClear;
  final int views;
  final int like;
  HotQuestion({
    required this.id,
    required this.title,
    required this.content,
    required this.userName,
    required this.created,
    required this.state,
    required this.isClear,
    required this.views,
    required this.like,
  });
  factory HotQuestion.fromJson(Map<String, dynamic> json) {
    return HotQuestion(
      id: json['id'],
      title: json['title'],
      content: json['content'],
      userName: json['user_id'],
      created: json['created'],
      state: json['state'],
      isClear: json['is_clear'],
      views: json['views'],
      like: json['like'],
    );
  }
}
