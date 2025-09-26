import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/utils/design/appBar/drawer.dart';
import 'package:flutter_application_1/utils/design/fonts.dart' as design;
import 'package:flutter_application_1/utils/design/appBar/appBar.dart'
    as appBar;
import 'package:flutter_application_1/utils/provider/router_provider.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_application_1/hotPost/view/hot_post.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print('Handling a background message ${message.messageId}');
}

late AndroidNotificationChannel channel;
late FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin;

void initializeNotification() async {
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  channel = const AndroidNotificationChannel(
    'high_importance_channel', // id
    'High Importance Notifications', // title
    description:
        'This channel is used for important notifications.', // description
    importance: Importance.high,
  );
  var initialzationSettingsAndroid =
      const AndroidInitializationSettings('@mipmap/ic_launcher');
  // var initialzationSettingsIOS
  flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();
  await flutterLocalNotificationsPlugin
      .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>()
      ?.createNotificationChannel(channel);
  var initializationSettings =
      InitializationSettings(android: initialzationSettingsAndroid);
  await flutterLocalNotificationsPlugin.initialize(initializationSettings);
  await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(
      alert: true, badge: true, sound: true);
}

Future<String?> getMyDeviceToken() async {
  return await FirebaseMessaging.instance.getToken();
}

void main() async {
  await dotenv.load(fileName: "assets/settings/.env");
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  initializeNotification();
  runApp(const ProviderScope(child: Myapp()));
}

class Myapp extends ConsumerWidget {
  const Myapp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    return MaterialApp.router(
      title: 'coding app',
      debugShowCheckedModeBanner: false,
      routerDelegate: router.routerDelegate,
      routeInformationParser: router.routeInformationParser,
      routeInformationProvider: router.routeInformationProvider,
    );
  }
}

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  List<Widget> LanguageBanner = [
    BuildLangeBanner(
        language: 'C\nLanguage',
        index: 0,
        iconPath: 'assets/icons/languages/cIcon.png'),
    BuildLangeBanner(language: 'Comming Soon', index: 1, iconPath: null)
  ];
  List<Widget> boardBanner = [
    Container(
        decoration: design.boxDecoration(),
        child: Center(
            child: Text(
          '...loding',
          style: design.textStyle(40),
        )))
  ];
  List<Widget> questionBanner = [
    Container(
        decoration: design.boxDecoration(),
        child: Center(
            child: Text(
          '...loding',
          style: design.textStyle(40),
        )))
  ];

  @override
  void initState() {
    getMyDeviceToken();
    FirebaseMessaging.onMessage.listen((RemoteMessage message) async {
      RemoteNotification? notification = message.notification;
      AndroidNotification? android = message.notification?.android;
      var androidNotiDetails = AndroidNotificationDetails(
          channel.id, channel.name,
          channelDescription: channel.description);
      var details = NotificationDetails(android: androidNotiDetails);
      if (notification != null) {
        flutterLocalNotificationsPlugin.show(notification.hashCode,
            notification.title, notification.body, details);
      }
    });
    FirebaseMessaging.onMessageOpenedApp.listen((message) {
      print(message);
    });
    hotPost(true, context).then((value) {
      setState(() {
        boardBanner = value;
      });
    });
    hotPost(false, context).then((value) => {
          setState(() {
            questionBanner = value;
          })
        });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    // Scaffold is a layout for
    // the major Material Components.
    return Scaffold(
      endDrawer: Drawer(child: navigationBar(ref, context)),
      backgroundColor: Colors.black87,
      appBar: appBar.appBarContainer(context, ref, true),
      // body is the majority of the screen.
      body: Column(children: [
        Expanded(
            flex: 1,
            child: Align(
              alignment: Alignment.centerLeft,
              child: Align(
                alignment: Alignment.centerLeft,
                child: explainSentenceWidget(
                    ' select language', Icons.code_rounded),
              ),
            )),
        Expanded(
            flex: 3,
            child: SizedBox(
                width: 350, child: bannerWidget(banner: LanguageBanner))),
        const SizedBox(
          height: 20,
        ),
        Expanded(
            flex: 1,
            child: Align(
              alignment: Alignment.centerLeft,
              child: explainSentenceWidget(' hot posts', Icons.whatshot),
            )),
        Expanded(
            flex: 3,
            child:
                SizedBox(width: 350, child: bannerWidget(banner: boardBanner))),
        const SizedBox(
          height: 20,
        ),
        Expanded(
            flex: 1,
            child: Align(
              alignment: Alignment.centerLeft,
              child: explainSentenceWidget(
                  ' hot questions', Icons.whatshot_outlined),
            )),
        Expanded(
            flex: 3,
            child: SizedBox(
                width: 350, child: bannerWidget(banner: questionBanner))),
        const SizedBox(
          height: 20,
        ),
      ]),
    );
  }
}

class bannerWidget extends StatefulWidget {
  final List<Widget> banner;
  bannerWidget({required this.banner});
  @override
  _bannerWidgetState createState() => _bannerWidgetState();
}

class _bannerWidgetState extends State<bannerWidget> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  @override
  Widget build(BuildContext context) {
    return Stack(children: [
      PageView(
        controller: _pageController,
        onPageChanged: (int page) {
          setState(() {
            _currentPage = page;
          });
        },
        children: widget.banner,
      ),
      Align(
          alignment: Alignment.bottomCenter,
          child: Container(
            margin: const EdgeInsets.symmetric(vertical: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                for (int i = 0; i < widget.banner.length; i++)
                  Container(
                    margin: const EdgeInsets.all(4.0),
                    width: 12.0,
                    height: 12.0,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _currentPage == i
                          ? Colors.grey
                          : Colors.grey.withOpacity(0.5),
                    ),
                  ),
              ],
            ),
          ))
    ]);
  }
}

Widget explainSentenceWidget(String text, IconData icon) {
  return Row(children: [
    Icon(icon, color: Colors.white),
    Text(text, style: design.textStyle(16))
  ]);
}

class BuildLangeBanner extends StatefulWidget {
  final String language;
  final int index;
  final String? iconPath;
  BuildLangeBanner(
      {required this.language, required this.index, required this.iconPath});

  @override
  _BuildLangeBannerState createState() => _BuildLangeBannerState();
}

class _BuildLangeBannerState extends State<BuildLangeBanner> {
  @override
  Widget build(BuildContext context) {
    return InkWell(
        onTap: () => context.go('/codeBoard'),
        child: Container(
            decoration: design.boxDecoration(),
            child: widget.iconPath == null
                ? Center(
                    child: Text(
                    widget.language,
                    style: design.textStyle(40),
                  ))
                : Center(
                    child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                        Container(
                          margin: const EdgeInsets.only(right: 15),
                          width: 70,
                          child: Image.asset(widget.iconPath!),
                        ),
                        Text(
                          widget.language,
                          style: design.textStyle(30),
                        )
                      ]))));
  }
}
