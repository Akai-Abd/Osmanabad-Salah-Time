import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:ota_update/ota_update.dart';
import 'package:package_info_plus/package_info_plus.dart';

const String kVersionCheckUrl =
    'https://raw.githubusercontent.com/Akai-Abd/Osmanabad-Salah-Time/main/version.json';

/// Checks if an app update is available and presents an update dialog.
Future<void> checkAppUpdate(BuildContext context, {bool manual = false}) async {
  try {
    final info = await PackageInfo.fromPlatform();
    final res = await http
        .get(Uri.parse(kVersionCheckUrl))
        .timeout(const Duration(seconds: 10));

    if (res.statusCode != 200) {
      if (manual && context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not reach update server. Check your connection.')),
        );
      }
      return;
    }

    final data = jsonDecode(res.body) as Map<String, dynamic>;
    final String latestVersion = (data['version'] ?? '').toString().trim();
    final String apkUrl = (data['apk_url'] ?? '').toString().trim();
    final String notes = (data['notes'] ?? '').toString().trim();

    if (latestVersion.isEmpty || apkUrl.isEmpty) return;

    if (isNewerVersion(info.version, latestVersion) && context.mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => _UpdateDialog(
          latestVersion: latestVersion,
          notes: notes,
          apkUrl: apkUrl,
        ),
      );
    } else if (manual && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('App is up to date (v${info.version}).')),
      );
    }
  } catch (e) {
    debugPrint('App update check skipped: $e');
    if (manual && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Update check failed: $e')),
      );
    }
  }
}

/// Semver comparison: returns true if [remote] > [current].
@visibleForTesting
bool isNewerVersion(String current, String remote) {
  // Strip non-digit/dot prefixes (e.g. 'v1.0.1' -> '1.0.1')
  final cleanCurrent = current.replaceFirst(RegExp(r'^[^\d]+'), '');
  final cleanRemote = remote.replaceFirst(RegExp(r'^[^\d]+'), '');

  final cParts = cleanCurrent.split('.').map((e) => int.tryParse(e) ?? 0).toList();
  final rParts = cleanRemote.split('.').map((e) => int.tryParse(e) ?? 0).toList();

  final len = cParts.length > rParts.length ? cParts.length : rParts.length;
  for (int i = 0; i < len; i++) {
    final c = i < cParts.length ? cParts[i] : 0;
    final r = i < rParts.length ? rParts[i] : 0;
    if (r > c) return true;
    if (r < c) return false;
  }
  return false;
}

class _UpdateDialog extends StatefulWidget {
  final String latestVersion;
  final String notes;
  final String apkUrl;

  const _UpdateDialog({
    required this.latestVersion,
    required this.notes,
    required this.apkUrl,
  });

  @override
  State<_UpdateDialog> createState() => _UpdateDialogState();
}

class _UpdateDialogState extends State<_UpdateDialog> {
  bool _isDownloading = false;
  String _progress = '0';
  String? _errorMessage;

  void _startUpdate() {
    setState(() {
      _isDownloading = true;
      _errorMessage = null;
    });

    try {
      OtaUpdate()
          .execute(widget.apkUrl, destinationFilename: 'app-release.apk')
          .listen(
        (OtaEvent event) {
          if (!mounted) return;
          if (event.status == OtaStatus.DOWNLOADING) {
            setState(() {
              _progress = event.value ?? '0';
            });
          } else if (event.status == OtaStatus.INSTALLING) {
            setState(() {
              _progress = '100';
            });
            Future.delayed(const Duration(seconds: 1), () {
              if (mounted) Navigator.of(context, rootNavigator: true).pop();
            });
          } else if (event.status == OtaStatus.INSTALLATION_DONE) {
            Navigator.of(context, rootNavigator: true).pop();
          } else if (event.status == OtaStatus.ALREADY_RUNNING_ERROR) {
            setState(() => _errorMessage = 'Update already in progress.');
          } else if (event.status == OtaStatus.PERMISSION_NOT_GRANTED_ERROR) {
            setState(() => _errorMessage = 'Permission to install unknown apps was denied.');
          } else {
            setState(() => _errorMessage = 'Download error: ${event.status.name}');
          }
        },
        onError: (err) {
          if (!mounted) return;
          setState(() {
            _isDownloading = false;
            _errorMessage = 'Download failed: $err';
          });
        },
      );
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _isDownloading = false;
        _errorMessage = 'Error: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Update Available'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Version ${widget.latestVersion} is now available.'),
          if (widget.notes.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              widget.notes,
              style: TextStyle(
                fontSize: 13,
                color: Theme.of(context).textTheme.bodySmall?.color,
              ),
            ),
          ],
          if (_isDownloading) ...[
            const SizedBox(height: 16),
            LinearProgressIndicator(
              value: (double.tryParse(_progress) ?? 0) / 100.0,
            ),
            const SizedBox(height: 8),
            Center(
              child: Text(
                _progress == '100' ? 'Opening installer...' : 'Downloading: $_progress%',
                style: const TextStyle(fontSize: 12),
              ),
            ),
          ],
          if (_errorMessage != null) ...[
            const SizedBox(height: 12),
            Text(
              _errorMessage!,
              style: const TextStyle(color: Colors.red, fontSize: 12),
            ),
          ],
        ],
      ),
      actions: _isDownloading
          ? null
          : [
              TextButton(
                onPressed: () => Navigator.of(context, rootNavigator: true).pop(),
                child: const Text('Later'),
              ),
              FilledButton(
                onPressed: _startUpdate,
                child: const Text('Update Now'),
              ),
            ],
    );
  }
}
