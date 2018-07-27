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
type Advocate struct {
	AdvocateId    string `json:"advocateid"`
	AdvocdateName string `json:"advocateName"`
	CurrentOwner  string `json:"currentowner"`
	NewOwner      string `json:"newOwner"`
	DocumentHash  string `json:"documenthash"`
	Documenturl   string `json:"documenturl"`
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
	if function == "queryAdvocate" {
		return s.queryAdvocate(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createAdvocate" {
		return s.createAdvocate(APIstub, args)
	} else if function == "queryAllAdvocates" {
		return s.queryAllAdvocates(APIstub)
	}
	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) queryAdvocate(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	propertyAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(propertyAsBytes)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	advocate := []Advocate{
		Advocate{AdvocateId: "123", AdvocdateName: "mr white", CurrentOwner: "mr yellow", NewOwner: "mr red", DocumentHash: "####", Documenturl: "****"},
		Advocate{AdvocateId: "456", AdvocdateName: "mr blue", CurrentOwner: "mr voilet", NewOwner: "mr red", DocumentHash: "####", Documenturl: "****"},
	}

	i := 0
	for i < len(advocate) {
		fmt.Println("i is ", i)
		advocateAsBytes, _ := json.Marshal(advocate[i])
		APIstub.PutState("PROPERTY"+strconv.Itoa(i), advocateAsBytes)
		fmt.Println("Added", advocate[i])
		i = i + 1
	}

	return shim.Success(nil)
}

func (s *SmartContract) createAdvocate(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments. Expecting 7")
	}

	var approval = Advocate{AdvocateId: args[1], AdvocdateName: args[2], CurrentOwner: args[3], NewOwner: args[4], DocumentHash: args[5], Documenturl: args[6]}

	approvalAsBytes, _ := json.Marshal(approval)
	APIstub.PutState(args[0], approvalAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) queryHistoryAdvocate(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
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

	fmt.Printf("- queryAlladvocates:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())

}

func (s *SmartContract) queryAllAdvocates(APIstub shim.ChaincodeStubInterface) sc.Response {

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

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
