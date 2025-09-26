import 'package:code_text_field/code_text_field.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/login/utils/dio/dio.dart';
import 'package:flutter_application_1/utils/design/appBar/drawer.dart';
import 'package:flutter_application_1/utils/design/fonts.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_application_1/utils/design/appBar/appBar.dart'
    as appBar;
import 'package:flutter/material.dart';
import 'package:code_text_field/code_text_field.dart';
// Import the language & theme
import 'package:highlight/languages/dart.dart';
import 'package:highlight/languages/cpp.dart';
import 'package:flutter_highlight/themes/monokai-sublime.dart';

final baseUrl = dotenv.env['BaseURL'];

class CodePage extends ConsumerStatefulWidget {
  const CodePage({super.key});
  @override
  _CodePageState createState() => _CodePageState();
}

class _CodePageState extends ConsumerState<CodePage> {
  CodeController? _codeController;
  @override
  void initState() {
    super.initState();
    var source =
        "#include <iostream>\nint main() {\n    std::cout << \"Hello World!\";\n     return 0;\n}";
    // Instantiate the CodeController
    _codeController = CodeController(
      text: source,
      language: cpp,
    );
  }

  var output = "> ▍";
  final dio = Dio();
  final valueList = ['cpp'];
  var selectedValue = 'cpp';
  ScrollController codeScrollController = ScrollController();
  ScrollController outputScrollController = ScrollController();
  @override
  Widget build(BuildContext context) {
    final dio = ref.watch(dioProvider);
    return Scaffold(
      endDrawer: appBar.appBarContainer(context, ref, false),
      backgroundColor: Colors.black87,
      appBar: appBar.appBarContainer(context, ref, true),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch, // 가로로 꽉 차도록 설정
        children: [
          Expanded(
            flex: 1,
            child: Row(
              children: [
                const SizedBox(width: 10),
                SizedBox(
                  width: 200,
                  child: DropdownButton(
                    value: selectedValue,
                    icon: Icon(Icons.arrow_downward),
                    iconSize: 24,
                    elevation: 16,
                    isExpanded: true,
                    dropdownColor: Colors.black,
                    style: textStyle(20),
                    items:
                        valueList.map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(
                          value,
                          style: textStyle(20),
                        ),
                      );
                    }).toList(),
                    onChanged: (value) => {
                      setState(() {
                        selectedValue = value!;
                      })
                    },
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color.fromARGB(1000, 24, 31, 41),
                    ),
                    child: Text("Run ▶", style: textStyle(20)),
                    onPressed: () async {
                      try {
                        setState(() {
                          output = "> building...\n ▍";
                        });
                        final data = await dio.post('$baseUrl/code_jobs/start',
                            data: {
                              'langauge': selectedValue,
                              'code': _codeController!.text
                            });
                        if (data.data['output'] == "" ||
                            data.statusCode != 200) {
                          throw Exception(data);
                        } else {
                          setState(() {
                            output = "> ${data.data['output']} ▍";
                          });
                        }
                      } catch (err) {
                        showDialog(
                            context: context,
                            builder: (context) {
                              return AlertDialog(
                                title: const Text('Error'),
                                content: const Text('Failed to run the code'),
                                actions: [
                                  TextButton(
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                      },
                                      child: const Text('OK'))
                                ],
                              );
                            });
                      }
                    })
              ],
            ),
          ),
          Expanded(
              flex: 4, // 9:1 비율로 나누어짐
              child: SingleChildScrollView(
                  controller: codeScrollController,
                  physics: BouncingScrollPhysics(),
                  child: CodeTheme(
                      data: const CodeThemeData(
                          styles: monokaiSublimeTheme), // Theme
                      child: SizedBox(
                        height: 300,
                        child: CodeField(
                          controller: _codeController!,
                          textStyle: const TextStyle(fontFamily: 'SourceCode'),
                        ),
                      )))),
          Expanded(
              flex: 4,
              child: SizedBox(
                  height: 300,
                  child: Container(
                    alignment: Alignment.topLeft,
                    color: Colors.black,
                    child: SingleChildScrollView(
                        padding: const EdgeInsets.all(10),
                        controller: outputScrollController,
                        physics: BouncingScrollPhysics(),
                        child: Text(
                          output,
                          style: boldStyle(20),
                        )),
                  )))
        ],
      ),
    );
  }
}
