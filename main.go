// main.go
package main

import (
	"os"
	"fmt"
	"log"
	"net/http"
	"encoding/json"
	"MonteCarloStocks/util"
	"github.com/markthelaw/GoStatHelper/StatUtil"
	"github.com/gorilla/mux"
)








func main() {
	r := mux.NewRouter().StrictSlash(false)
	posts := r.Path("/posts").Subrouter()
	posts.Methods("POST").HandlerFunc(test)
	r.PathPrefix("/web/").Handler(http.StripPrefix("/web/", http.FileServer(http.Dir("./web"))))
	r.HandleFunc("/monte/",  helloMonteStock)
	r.HandleFunc("/test/",  test)
	
	fmt.Println("listening...")
	
	serveSingle("/favicon.ico", "./web/favicon.ico")
	
	http.Handle("/", r)

	err := http.ListenAndServe(":"+os.Getenv("PORT"), nil)
    if err != nil {
      panic(err)
    }
	
	
}

type returnObject struct{
	Stock util.Stock
	MonteResult [][]float64
}

func test(w http.ResponseWriter, request *http.Request) {
	//testing

	log.Printf("requestBody is %v\n", request.Body)
    decoder := json.NewDecoder(request.Body)
	log.Printf("decoder is %v\n", decoder)
    var t util.Stock   
    err := decoder.Decode(&t)
	
    if err != nil {
        //panic(fmt.Sprintf("hi"))
		fmt.Println(err)
    }
	fmt.Printf("util.stock Mean is %v\n", t.Mean)
	fmt.Printf("util.stock Stdv is %v\n", t.Stdv)
	fmt.Printf("util.stock Times is %v\n", t.Times)
	fmt.Printf("util.stock Years is %v\n", t.Years)
	sumChannel := make(chan [][]float64)
	result := returnObject{t, util.MonteYears(t, sumChannel)}
	fmt.Println(result)
    log.Printf("Years is %v\n", t.Years)
	js, err := json.Marshal(result)
	w.Header().Set("Content-Type", "application/json")
  	w.Write(js)
}

func helloMonteStock(w http.ResponseWriter, request *http.Request){
	stockTemp := util.Stock{0.1, 0.2, 10, 20}

	fmt.Println(StatUtil.InverserNormalCDF(2))
	fmt.Println(StatUtil.InverseNormalDist(0.5, 1, 2))
	//fmt.Println(InverseNormalDist(0.4, 1, 4))
	//fmt.Println(InverseNormalDist(0.1, 0.1, 0.12))
	sumChannel := make(chan [][]float64)
	result := returnObject{stockTemp, util.MonteYears(stockTemp, sumChannel)}
	
	js, err := json.Marshal(result)
	
  	if err != nil {
    	http.Error(w, err.Error(), http.StatusInternalServerError)
    	return
  	}
	fmt.Println(result)
	w.Header().Set("Content-Type", "application/json")
  	w.Write(js)
}
