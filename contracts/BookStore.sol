// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract BookStore is ERC1155 {

    uint256 private _currentBookVersionId;

    mapping (uint256 => BookVersion) private _bookVersions;

    struct BookVersion {
        uint256 price;
        address currency;
        address author;
    }

    constructor() ERC1155('https://example.com/api/{id}.json') {
        _currentBookVersionId = 1;
    }

    function publish(uint256 _quantity, uint256 _price, address _currency) public {
        _mint(msg.sender, _currentBookVersionId, _quantity, "");

        _bookVersions[_currentBookVersionId] = BookVersion(_price, _currency, msg.sender);
        _currentBookVersionId += 1;
    }

    function purchaseFromAuthor(uint256 _bookVersionId) public {
        BookVersion memory bookVersion = _bookVersions[_bookVersionId];
        safeTransferFrom(bookVersion.author, msg.sender, _bookVersionId, 1, "");
    }

    function bookVersionPrice(uint256 _bookVersionId) public view returns(uint256) {
        return _bookVersions[_bookVersionId].price;
    }
    function bookVersionCurrency(uint256 _bookVersionId) public view returns(address) {
        return _bookVersions[_bookVersionId].currency;
    }

}