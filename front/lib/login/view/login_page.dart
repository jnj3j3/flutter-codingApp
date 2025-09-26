import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_application_1/utils/design/appBar/appBar.dart'
    as appBar;
import 'package:flutter_application_1/utils/design/fonts.dart' as design;
import 'package:flutter_application_1/login/model/user_model.dart';
import 'package:flutter_application_1/login/provider/user_me_provider.dart';
import 'package:http/http.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

Text incorrectText = const Text(
  'Incorrect Id or Password',
  style: TextStyle(color: Colors.red, fontSize: 15),
);
Text passwordProblemText = const Text(
  'Must input your Password',
  style: TextStyle(color: Colors.red, fontSize: 15),
);
Text idProblemText = const Text(
  'Must input your Id',
  style: TextStyle(color: Colors.red, fontSize: 15),
);

class LoginPageWidget extends ConsumerStatefulWidget {
  const LoginPageWidget({super.key});
  @override
  _LoginPageWidgetState createState() => _LoginPageWidgetState();
}

class _LoginPageWidgetState extends ConsumerState<LoginPageWidget> {
  bool loginFailed = false;
  final _idTextFieldController = TextEditingController();
  final _passwordTextFieldController = TextEditingController();
  @override
  void dispose() {
    _idTextFieldController.dispose();
    _passwordTextFieldController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
  }

  Text problemText = incorrectText;
  @override
  Widget build(BuildContext context) {
    final state = ref.watch(userMeProvider);
    return Scaffold(
        backgroundColor: Colors.black87,
        appBar: appBar.appBarContainer(context, ref, false),
        body: Container(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Login',
                  textAlign: TextAlign.center, style: design.boldStyle(35)),
              Container(
                alignment: Alignment.center,
                margin: const EdgeInsets.only(top: 20),
                child: Column(
                  children: [
                    Container(
                      width: MediaQuery.of(context).size.width * 0.8,
                      margin: const EdgeInsets.only(bottom: 20, top: 10),
                      child: TextField(
                        controller: _idTextFieldController,
                        style: design.boldStyle(20),
                        decoration: const InputDecoration(
                          prefixIcon: Icon(
                            Icons.person,
                            color: Colors.white,
                          ),
                          border: OutlineInputBorder(),
                          labelText: 'ID',
                        ),
                      ),
                    ),
                    Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      width: MediaQuery.of(context).size.width * 0.8,
                      child: TextField(
                        controller: _passwordTextFieldController,
                        style: design.boldStyle(20),
                        decoration: const InputDecoration(
                          prefixIcon: Icon(Icons.lock, color: Colors.white),
                          border: OutlineInputBorder(),
                          labelText: 'Password',
                        ),
                      ),
                    ),
                    loginFailed
                        ? problemText
                        : const SizedBox(
                            width: 0,
                            height: 0,
                          ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Don\'t have an account? ',
                          style: design.boldStyle(15),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/signup');
                          },
                          child: Text('Sign up',
                              style: design.purpleUnderLine(20)),
                        ),
                      ],
                    ),
                    Container(
                      margin: const EdgeInsets.only(top: 10),
                      child: ElevatedButton(
                        onPressed: state is UserModelLoading
                            ? null
                            : () async {
                                if (_idTextFieldController.text.isEmpty) {
                                  setState(() {
                                    problemText = idProblemText;
                                    loginFailed = true;
                                  });
                                  return;
                                } else if (_passwordTextFieldController
                                    .text.isEmpty) {
                                  setState(() {
                                    problemText = passwordProblemText;
                                    loginFailed = true;
                                  });
                                  return;
                                } else {
                                  await ref.read(userMeProvider.notifier).login(
                                      id: _idTextFieldController.text,
                                      password:
                                          _passwordTextFieldController.text);
                                }
                              },
                        child: const Text('LOGIN'),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ));
  }
}
