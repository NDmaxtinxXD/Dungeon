# DungeonEscape
Chào mừng bạn đến với dự án Game 2D kết hợp giữa thể loại Giải đố (Puzzle) và Sinh tồn (Survival Action) được xây dựng hoàn toàn bằng JavaScript thuần (Canvas API).

🚀 Hướng dẫn chạy game
Để trải nghiệm game trên máy tính cục bộ của bạn, hãy đảm bảo bạn đã cài đặt Node.js. Sau đó mở Terminal tại thư mục gốc của dự án và chạy câu lệnh sau:

Bash
[npm run dev]
Trình duyệt sẽ tự động mở hoặc cung cấp cho bạn một đường dẫn (thường là http://localhost:5173) để vào chơi ngay lập tức.

⌨️ Hướng dẫn điều khiển
Hệ thống điều khiển được thiết kế tối ưu cho trải nghiệm linh hoạt:

W, A, S, D: Di chuyển nhân vật theo 4 hướng (Lên, Trái, Xuống, Phải).

Space (Phím cách): Lướt (Dash) - Giúp nhân vật tăng tốc đột ngột để né tránh sát thương hoặc lách qua kẻ thù.

N: Bỏ qua màn hiện tại (Skip Level).

⚠️ LƯU Ý QUAN TRỌNG: Phím này là "phao cứu sinh" cuối cùng. Xin vui lòng chỉ sử dụng nút này khi bạn thực sự đã bỏ cuộc và không thể tự mình giải được câu đố!

👾 Các thực thể trong game (Entities)
Trò chơi bao gồm nhiều thử thách khác nhau được rải rác qua các màn chơi:

1. Nhân vật chính (Player)
Người hùng của chúng ta! Bạn sẽ điều khiển nhân vật này khám phá ngục tối, tìm cách giải mã các căn phòng và sinh tồn trước những kẻ thù nguy hiểm. Bạn có khả năng lướt (dash) để tạo lợi thế trong giao tranh.

2. Hộp đẩy (Màn 1)
Đây là chướng ngại vật và cũng là chìa khóa của màn chơi giải đố. Bạn cần tính toán không gian và hướng đi để đẩy các khối hộp này vào đúng vị trí công tắc (Button) nhằm kích hoạt cơ chế mở cửa qua màn.

3. Boss (Màn 2)
Kẻ thù cản bước đầu tiên mang tính thử thách cao. Boss màn 2 sẽ truy đuổi và yêu cầu bạn phải kết hợp nhuần nhuyễn giữa việc di chuyển và sử dụng kỹ năng lướt (Space) để né đòn.

4. Ác Mộng Cuối Cùng: Boss Màn 3
Màn 3 không còn là giải đố, đây là một đấu trường sinh tồn thực sự. Boss màn 3 là một thực thể vô cùng mạnh mẽ, trải qua 3 hình thái (Phases) đột biến:

Phase 1 (Khởi động): Boss bắt đầu thăm dò và tấn công với nhịp độ vừa phải. Bạn cần học cách làm quen với quy luật di chuyển của nó.

Phase 2 (Nổi điên): Khi bị kích động, Boss chuyển sang Phase 2. Tốc độ tấn công tăng vọt, các đòn đánh trở nên khó đoán hơn (hệ thống âm nhạc cũng sẽ chuyển sang giai điệu kịch tính để dồn ép người chơi).

Phase 3 (Tối thượng): Hình thái nguy hiểm nhất của Boss. Trận chiến lúc này là bài kiểm tra giới hạn phản xạ của bạn. Chỉ những người chơi kiên nhẫn và khéo léo nhất mới có thể sống sót và phá đảo trò chơi!
