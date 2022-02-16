class Data {
    constructor() {
        getData().then(datas => {
          datas.sort(function (a, b) {
            if (a.id < b.id) { return 1;}
            if (a.id > b.id) { return -1;}
            return 0;
          });
          this._db = datas; // fetched movies
          this.num = this._db.length - 1;
          showList.render(data.read());
        });
    }
    
    read() {
        return this._db;
    }
    
    insert(data) {
        if(!data) return;
        this.num++;
        let post = {
          id : this.num,
          title : data.title,
          desc : data.desc,
          date : this.formateDate()
        }
        this._db.unshift(post);
    }
    
    modify(data, index, num) {
        if(!data) return;
  
        let post = {
          id : num,
          title : data.title,
          desc : data.desc,
          date : this.formateDate()
        }
        this._db[index] = post;
    }
    
    delete(index) {
        this._db.splice(index, 1);
    }  
    
    formateDate() {
        let date = new Date();
         let year = date.getFullYear();     
         let month = '' + (date.getMonth()+1);
         let day = '' + date.getDate();
  
         if(month.length < 2) month = '0' + month;
         if(day.length < 2) day = '0' + day; 
  
         return [year, month, day].join('-');
    }
  }
  
  class InputEvent {
    constructor({save}) {    
        this.init({save});
        this.beginEvent();
    }
    
    init({save}) {
        this.$createBtn = document.getElementById("createBtn");
        this.$title = document.querySelector(".title");
        this.$desc = document.querySelector(".desc");
        this.$btnSend = document.getElementById("send");
        this.$btnCancel = document.getElementById("writeCancel"); 
        this.save = save;			      
    }
    
    beginEvent() {
      let self = this;

      this.$createBtn.addEventListener("click", (e)=>{
            self.$title.value = "";
            self.$desc.value = "";
      });

      this.$btnSend.addEventListener("click", (e)=>{
          e.preventDefault();
          let titleValue = self.$title.value;
          let descValue = self.$desc.value;
          
          if(titleValue==="" || descValue==="") { return; }
            
          let dataValue = {
            title : titleValue,
            desc : descValue
          }
          
          self.$title.value = "";
          self.$desc.value = "";
        
          self.save(dataValue);
          $('#writeModal').modal('hide');
      })
      
      self.$btnCancel.addEventListener("click", (e)=>{ 
          e.preventDefault();
          mode="write";
          self.$title.value = "";
          self.$desc.value = "";
      })
    }
  }
  
  class ShowList {
    constructor({del, modify}) {  
        this.init({del, modify});
    }
    
    init({del, modify}) {
        this.$createBtn = document.getElementById("createBtn");
        this.$showModal = document.getElementById("showModal");
        this.$writeModal = document.getElementById("writeModal");
        this.$showCancel = document.getElementById("showCancel"); 
        this.$modalId = this.$showModal.querySelector("#_id");
        this.$modalTitle = this.$showModal.querySelector(".modal-title");
        this.$modalBody = this.$showModal.querySelector(".modal-body");
        this.$modalDesc = this.$modalBody.querySelector("p");
        this.$BoxList = document.getElementById("dataList");
        this.$tbody = this.$BoxList.tBodies[0];
        this.$dataList = this.$tbody.getElementsByClassName("post");
        this.$title = document.querySelector(".title");
        this.$desc = document.querySelector(".desc");
        this.del = del;
        this.modify = modify;	
    }
    
    render(db) {
      let self = this;
      this.$tbody.innerHTML = "";
      
      db.map((data)=>{        
          let item = document.createElement("tr");	
          item.classList.add("post");	
          item.setAttribute("data-toggle", "modal");
          item.setAttribute("data-target", "#showModal");
        
          let tags = `	
              <th scope="row">${data.id+1}</th>
              <td>${data.title}</td>
              <td>${data.desc}</td>
              <td>${data.date}</td>  
          `;	
          item.innerHTML=tags;
          self.$tbody.appendChild(item);	   
      })       
      
          let inputTitle, inputDesc, inputNum, targetIndex = null;
        for(let k=0; k<self.$dataList.length; k++){
              (function(_index){
                self.$dataList[k].addEventListener("click", (e)=>{
                  e.preventDefault();
                  targetIndex = _index;
                  inputNum = db[_index].id;
                  self.$modalId.value = targetIndex;
                  inputTitle = e.currentTarget.children[1].innerText;
                  self.$modalTitle.innerText = inputTitle;	
                  inputDesc = e.currentTarget.children[2].innerText;
                  self.$modalDesc.innerText = inputDesc;	
                })					
              })(k);
        }
      
          let $btnModify = document.getElementById("btnModify");
          $btnModify.addEventListener("click", (e)=>{
              e.preventDefault();
              $('#showModal').modal('hide');
              $('#writeModal').modal('show');
              self.modify(targetIndex, inputNum);
              self.$title.value = inputTitle;
              self.$desc.value = inputDesc;
          });
      
          let $btnDel = document.getElementById("btnDel");        
          $btnDel.onclick = () => {
            targetIndex = self.$modalId.value;
            if(targetIndex === null) return;	
            $('#showModal').modal('hide');
            self.del(targetIndex);	 
          }
            //   $btnDel.addEventListener("click", (e)=>{   
            //       e.preventDefault();
            //       console.log(`$btnDel index : ${self.$modalId.value}`);
            //       targetIndex = self.$modalId.value;
            //       if(targetIndex === null) return;	
            //       $('#showModal').modal('hide');
            //       self.del(targetIndex);	 
            //   });	
    }
  }
  
  let modifyIndex=0;
  let mode ="write";
  let data = new Data();
  
  let showList = new ShowList({ 
      del:function(index){
          data.delete(index);
          showList.render(data.read());
      },
      modify:function(index, inputNum){
          mode = "modify"; 
          modifyIndex = index; 
      modifyNum = inputNum;
      }
  });
  
  let inputEvent = new InputEvent({
      save : function(value){
          if(mode=="write"){
              data.insert(value);
              showList.render(data.read());	
          }else{
              data.modify(value, modifyIndex, modifyNum);
              showList.render(data.read());		
              mode = "write";
          }		
      }
  });
  
  async function getData() {
    const url = "https://yujiseon.github.io/training/crud/data.json";
    const response = await fetch(url);
    const datas = await response.json();
    return datas;
  }
  
  
  