import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_app/updater.dart';

void main() {
  group('isNewerVersion', () {
    test('returns true when remote has higher major version', () {
      expect(isNewerVersion('1.0.0', '2.0.0'), isTrue);
    });

    test('returns true when remote has higher minor version', () {
      expect(isNewerVersion('1.0.0', '1.1.0'), isTrue);
    });

    test('returns true when remote has higher patch version', () {
      expect(isNewerVersion('1.0.0', '1.0.1'), isTrue);
    });

    test('handles v prefix correctly', () {
      expect(isNewerVersion('1.0.0', 'v1.0.1'), isTrue);
      expect(isNewerVersion('v1.0.0', '1.0.1'), isTrue);
    });

    test('returns false when versions are identical', () {
      expect(isNewerVersion('1.0.0', '1.0.0'), isFalse);
      expect(isNewerVersion('1.2.3', '1.2.3'), isFalse);
    });

    test('returns false when remote version is older', () {
      expect(isNewerVersion('2.0.0', '1.9.9'), isFalse);
      expect(isNewerVersion('1.1.0', '1.0.9'), isFalse);
    });

    test('handles differing segment lengths', () {
      expect(isNewerVersion('1.0', '1.0.1'), isTrue);
      expect(isNewerVersion('1.0.1', '1.0'), isFalse);
    });
  });
}

