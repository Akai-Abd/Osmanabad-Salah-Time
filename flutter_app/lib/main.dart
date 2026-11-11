import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'updater.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Color(0xFF547FA5),
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Osmanabad Salah Time',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF547FA5)),
        useMaterial3: true,
      ),
      home: const SalahWebViewPage(),
    );
  }
}

class SalahWebViewPage extends StatefulWidget {
  const SalahWebViewPage({super.key});

  @override
  State<SalahWebViewPage> createState() => _SalahWebViewPageState();
}

class _SalahWebViewPageState extends State<SalahWebViewPage> {
  HttpServer? _server;
  WebViewController? _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _startServerAndLoad();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) checkAppUpdate(context);
    });
  }

  Future<void> _startServerAndLoad() async {
    try {
      // Local server prevents CORS & ES-module issues with Android WebView.
      // Use a fixed port so the WebView origin (http://127.0.0.1:port) stays constant,
      // preserving localStorage (language, village, theme) across app restarts.
      const fixedPort = 48753;
      try {
        _server = await HttpServer.bind(InternetAddress.loopbackIPv4, fixedPort, shared: true);
      } catch (e) {
        _server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
      }
      final port = _server!.port;

      _server!.listen((HttpRequest request) async {
        var path = request.uri.path;
        if (path == '/' || path.isEmpty) {
          path = '/index.html';
        }

        final assetKey = 'assets/dist$path';
        try {
          final data = await rootBundle.load(assetKey);
          final bytes = data.buffer.asUint8List();

          _setContentType(request.response, path);
          request.response.headers.add('Access-Control-Allow-Origin', '*');
          request.response.add(bytes);
          await request.response.close();
          debugPrint('HTTP 200: $path');
        } catch (e) {
          debugPrint('HTTP 404: $path (error: $e)');
          request.response.statusCode = HttpStatus.notFound;
          await request.response.close();
        }
      });

      final controller = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setBackgroundColor(const Color(0xFF547FA5))
        ..setOnConsoleMessage((message) {
          debugPrint('JS: [${message.level.name}] ${message.message}');
        })
        ..setNavigationDelegate(
          NavigationDelegate(
            onPageFinished: (_) {
              if (mounted) setState(() => _isLoading = false);
            },
          ),
        )
        ..addJavaScriptChannel(
          'FlutterApp',
          onMessageReceived: (JavaScriptMessage message) {
            if (message.message == 'checkUpdate' && mounted) {
              checkAppUpdate(context, manual: true);
            }
          },
        )
        ..loadRequest(Uri.parse('http://127.0.0.1:$port/'));

      if (mounted) {
        setState(() {
          _controller = controller;
        });
      }
    } catch (e) {
      debugPrint('Error starting local server: $e');
    }
  }

  void _setContentType(HttpResponse response, String path) {
    if (path.endsWith('.html')) {
      response.headers.contentType = ContentType('text', 'html', charset: 'utf-8');
    } else if (path.endsWith('.js') || path.endsWith('.mjs')) {
      response.headers.contentType = ContentType('application', 'javascript', charset: 'utf-8');
    } else if (path.endsWith('.css')) {
      response.headers.contentType = ContentType('text', 'css', charset: 'utf-8');
    } else if (path.endsWith('.json')) {
      response.headers.contentType = ContentType('application', 'json', charset: 'utf-8');
    } else if (path.endsWith('.png')) {
      response.headers.contentType = ContentType('image', 'png');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      response.headers.contentType = ContentType('image', 'jpeg');
    } else if (path.endsWith('.svg')) {
      response.headers.contentType = ContentType('image', 'svg+xml');
    } else if (path.endsWith('.pdf')) {
      response.headers.contentType = ContentType('application', 'pdf');
    } else {
      response.headers.contentType = ContentType.binary;
    }
  }

  @override
  void dispose() {
    _server?.close(force: true);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        if (_controller != null && await _controller!.canGoBack()) {
          await _controller!.goBack();
        } else {
          SystemNavigator.pop();
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF547FA5),
        body: SafeArea(
          child: Stack(
            children: [
              if (_controller != null)
                WebViewWidget(controller: _controller!),
              if (_isLoading)
                const Center(
                  child: CircularProgressIndicator(
                    color: Colors.white,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
