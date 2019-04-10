Quy luật:
- Mỗi contract là 1 dự án (số tiền kêu gọi, thời gian yêu cầu, địa chỉ kêu gọi)
-> Mỗi lần muốn dùng phải deploy lại contract (sửa các thông số trên), copy abi và address của contract rồi add vào App.js để chạy.
- Mọi người có thể vào ủng hộ (bằng Ethereum) cho dự án. 
- Khi hết thời gian yêu cầu: 
+) Nếu đủ tiền: Địa chỉ kêu gọi phải gửi yêu cầu tới các người gửi, xin được rút tiền về. Nếu tổng số tiền của những người gửi tiền trên 50% mà đồng ý thì tiền sẽ được gửi, còn không vẫn giữ trong contract.
+) Nếu chưa đủ tiền: Người gửi có quyền rút lại số tiền mình đã gửi. Nếu không rút thì tiền vẫn giữ trong contract.
+) Sau khoảng thời gian 'x' kể từ khi hết thời gian, sẽ chuyển toàn bộ số tiền còn lại trong contract cho người kêu gọi rồi hủy contract (x do người tạo contract đặt hoặc theo mặc định là 10 ngày).
