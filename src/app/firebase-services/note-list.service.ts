import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collectionData, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  firestore: Firestore = inject(Firestore);
  
  unsubNotes;
  unsubTrash;


  constructor() {

    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
  }

  async deleteNote(colId: string, docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => {console.log(err);}
      
    ).then();
  }

  async updateNote(note: Note) {
    if(note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => {console.log(err);}
        )
    }
  }

  getCleanJson(note: Note) {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getColIdFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes'
    } else {
      return 'trash'
    }
  }

  // async addNote(item: Note) {
  //   await addDoc(this.getNotesRef(), item).catch(
  //     (err) => {console.error(err)}
  //   ).then(
  //     (docRef) => {   console.log('Document written with id', docRef?.id)}
  //   )
  // }
  async addNote(item: Note, colId: "notes" | "trash" = "notes") {
    const collectionRef = colId === "notes" ? this.getNotesRef() : this.getTrashRef();
    await addDoc(collectionRef, item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log('Document written with id', docRef?.id) }
    );
  }

  ngonDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    })
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    })
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getSingleDocRef(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
