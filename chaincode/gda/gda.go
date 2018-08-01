package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

// Define the property structure, with 4 properties.  Structure tags are used by encoding/json library
type Approval struct {
	CurrentOwner   string `json:"currentowner"`
	Approvalstatus string `json:"approvalstatus"`
}

/*
 * The Init method is called when the Smart Contract "property" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "property"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "queryApproval" {
		return s.queryApproval(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createApproval" {
		return s.createApproval(APIstub, args)
	} else if function == "queryAllApprovals" {
		return s.queryAllApprovals(APIstub)
	} else if function == "changeApprovalStatus" {
		return s.changeApprovalStatus(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) queryApproval(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	propertyAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(propertyAsBytes)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	properties := []Approval{
		Approval{CurrentOwner: "123", Approvalstatus: "not approved"},
		Approval{CurrentOwner: "456", Approvalstatus: "not approved"},
	}

	i := 0
	for i < len(properties) {
		fmt.Println("i is ", i)
		propertyAsBytes, _ := json.Marshal(properties[i])
		APIstub.PutState("PROPERTY"+strconv.Itoa(i), propertyAsBytes)
		fmt.Println("Added", properties[i])
		i = i + 1
	}

	return shim.Success(nil)
}

func (s *SmartContract) createApproval(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	var approval = Approval{CurrentOwner: args[1], Approvalstatus: args[2]}

	approvalAsBytes, _ := json.Marshal(approval)
	APIstub.PutState(args[0], approvalAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) queryHistoryApproval(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("incorrect number of arguments 1 required ")

	}
	historyIer, err := APIstub.GetHistoryForKey(args[0])
	if err != nil {
		fmt.Println(err.Error())
		return shim.Error(err.Error())
	}
	defer historyIer.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for historyIer.HasNext() {
		queryResponse, err := historyIer.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(args[0])
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllproperties:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())

}

func (s *SmartContract) queryAllApprovals(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "PROPERTY0"
	endKey := "PROPERTY999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllproperties:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) changeApprovalStatus(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	approvalAsBytes, _ := APIstub.GetState(args[0])
	approval := Approval{}

	json.Unmarshal(approvalAsBytes, &approval)
	approval.Approvalstatus = args[1]

	approvalAsBytes, _ = json.Marshal(approval)
	APIstub.PutState(args[0], approvalAsBytes)

	return shim.Success(nil)
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
