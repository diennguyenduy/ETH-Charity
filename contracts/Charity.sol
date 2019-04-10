pragma solidity ^0.4.23;

contract Charity1 {
    uint public requiredFund;
    address public receiverAddress;
    uint256 public deadLine; 
    uint ETH = 1 ether;
    address public owner;
    uint public totalFund;
    
    uint256 public start = block.timestamp;

    address[] public senders;
    
    mapping(address => bool) public isSended;
    mapping(address => uint) public fundSended; // truyền 1 uint vào sẽ trả ra những address gửi vào số tiền đó
    
    uint public numberOfSenders = 0;

    constructor(uint _requiredFund, address _receiverAddress, uint256 _time) public {
        owner = msg.sender;
        requiredFund = _requiredFund; // (in ETH)
        receiverAddress = _receiverAddress;
        deadLine = start + _time*(1 days); // input time in days
    //    deadLine = start + _time; // input time in seconds
    }
    
    // get time remain of activity (in hours)
    function timeRemain() public view returns (uint) {
        return (deadLine - now)/3600; // output time remain in hours
    //    return (deadLine - now); // out put time in seconds
    }
    
    // uint public time = deadLine - now; -> Sai vì time sẽ được tính luôn từ khi khởi tạo , nó sẽ tính deadLine = 0  -> under flow(static code)
    function sendMoney(uint _value) public payable {
        require(now <= deadLine);
        require(msg.sender.balance >= msg.value);
        require(msg.value >= _value*ETH); // value ở đây là số tiền mình sẽ chuyển vào contract (chỗ value ở Remix); hàm đảm bảo số tiền chuyển vào contract phải >= số tiền sẽ chuyển đi
        require(_value*ETH > 0);
        if (msg.value > _value*ETH) {
            msg.sender.transfer(msg.value - _value*ETH); // hàm rút lại số tiền thừa của phần chuyển vào nếu nó lớn hơn chỗ chuyển đi
        }
        totalFund += _value;
        
        fundSended[msg.sender] += _value;
        numberOfSenders ++;
        
        if(isSended[msg.sender] == false) {
            senders.push(msg.sender);
            isSended[msg.sender] = true;
        }
        
        if(totalFund >= requiredFund || now >= deadLine + (10 * (1 days))) {
            sendToReceiver();
        }
    }
    
    function sendToReceiver() internal {
       receiverAddress.transfer(address(this).balance); // chuyển toàn bộ số tiền ở contract vào địa chỉ bên
       destructContract();
    }

    function destructContract() internal {
        selfdestruct(receiverAddress);
    }
    
    // trả lại những địa chỉ đã gửi tiền vào dự án 
    function getTotalSender() public view returns (address[]) {
        return senders;
    }
    
    function checkValid() public view returns (bool) {
        if(now >= deadLine && totalFund <= requiredFund) {
            return true;
        } else
        return false;
    }
    
    // nếu hết thời gian diễn ra hoạt động mà vẫn chưa đủ tiền, người gửi có thể rút lại số tiền mình đã gửi
    function refund() public {
        require(now >= deadLine);
        require(fundSended[msg.sender] > 0);
        msg.sender.transfer(fundSended[msg.sender]*ETH);
        totalFund -= fundSended[msg.sender];
        fundSended[msg.sender] = 0;
    }
}
