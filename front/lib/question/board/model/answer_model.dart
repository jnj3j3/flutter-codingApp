class Answer {
  final int id;
  final String content;
  final String userName;
  final int parentId;
  final String created;
  final int state;
  final int is_selected;
  final int like;
  Answer({
    required this.id,
    required this.content,
    required this.userName,
    required this.parentId,
    required this.created,
    required this.state,
    required this.is_selected,
    required this.like,
  });
  factory Answer.fromJson(Map<String, dynamic> json) {
    return Answer(
      id: json['id'],
      content: json['content'],
      userName: json['user_id'],
      parentId: json['parent_id'],
      created: json['created'],
      state: json['state'],
      is_selected: json['is_selected'],
      like: json['like'],
    );
  }
}
