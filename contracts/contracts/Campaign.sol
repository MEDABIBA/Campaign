pragma solidity ^0.8.0;

contract Factory {
    address[] public deployedCampaings;

    function createCampaign(uint16 minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaings.push(address(newCampaign));
    }

    function getDeployedCampaings() public view returns (address[] memory) {
        return deployedCampaings;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    address public manager; // creator the contract
    uint16 public minimumContribution; // minimum value to join the campaign
    mapping(address => bool) public approvers; // investors
    uint16 approversCount;
    Request[] public requests;

    constructor(uint16 minimum, address sender) {
        manager = sender;
        minimumContribution = minimum;
    }

    modifier restricted() {
        require(msg.sender == manager, "The contact may call only manager! ");
        _;
    }

    function getSummary()
        public
        view
        returns (uint, uint, uint, uint, address)
    {
        return (
            address(this).balance,
            minimumContribution,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        if (!approvers[msg.sender]) {
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    function createRequest(
        string memory description,
        uint value,
        address recipient
    ) public restricted {
        uint requestIndex = requests.length;
        requests.push();
        Request storage newRequest = requests[requestIndex];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender], "You must be an investor");
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(
            request.approvalCount > (approversCount / 2),
            "Not enough approvals"
        );
        require(!request.complete, "This contract is already completed");
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}
