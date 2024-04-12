// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2, stdJson} from "forge-std/Test.sol";

import {Merkle} from "../src/AbegToken.sol";

contract AbegTest is Test {
    using stdJson for string;
    Merkle public merkle;
    struct Result {
        bytes32 leaf;
        bytes32[] proof;
    }

    struct User {
        address user;
        uint tokenId;
        uint amount;
    }
    Result public result;
    User public user;
    bytes32 root =
        0x975a7c306f2cbfe118f7ac5581c921a6478d956471fd166424c44ad5c3db4c34;

    address user1 = 0xc72046a9Be6aB21651278eDA3d76bD91F124790c;

    function setUp() public {
        merkle = new Merkle(root);
        string memory _root = vm.projectRoot();
        string memory path = string.concat(_root, "/merkleTree.json");

        string memory json = vm.readFile(path);
        string memory data = string.concat(_root, "/addressData.json");

        string memory dataJson = vm.readFile(data);

        bytes memory encodedResult = json.parseRaw(
            string.concat(".", vm.toString(user1))
        );
        user.user = vm.parseJsonAddress(
            dataJson,
            string.concat(".", vm.toString(user1), ".address")
        );
        user.tokenId = vm.parseJsonUint(
            dataJson,
            string.concat(".", vm.toString(user1), ".tokenId")
        );
        user.amount = vm.parseJsonUint(
            dataJson,
            string.concat(".", vm.toString(user1), ".amount")
        );
        result = abi.decode(encodedResult, (Result));
        console2.logBytes32(result.leaf);
    }

    function testClaimed() public {
        bool success = merkle.claim(
            user.user,
            user.tokenId,
            user.amount,
            result.proof
        );
        assertTrue(success);
    }

    function testAlreadyClaimed() public {
        merkle.claim(user.user, user.tokenId, user.amount, result.proof);
        vm.expectRevert("already claimed");
        merkle.claim(user.user, user.tokenId, user.amount, result.proof);
    }

    function testIncorrectProof() public {
        bytes32[] memory fakeProofleaveitleaveit;

        vm.expectRevert("not whitelisted");
        merkle.claim(
            user.user,
            user.tokenId,
            user.amount,
            fakeProofleaveitleaveit
        );
    }
}
