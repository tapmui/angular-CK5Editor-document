import { Component, VERSION, OnInit, AfterViewInit, ViewChild, OnChanges, ChangeDetectorRef, SimpleChanges, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ChangeEvent, FocusEvent, BlurEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { default as JSPDF } from 'jspdf';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  implements OnInit, OnChanges, AfterViewInit  {
  
  @ViewChild('pdfArea', {static: false}) pdfArea: ElementRef;
  @ViewChild('myEditor') myEditor: any;
  
  public formDataPreview?: string;
  
  public Editor = DecoupledEditor;
  
   //https://ckeditor.com/latest/samples/toolbarconfigurator/index.html#basic
  public editorConfig;
  public isReadOnly = false;
  
  public componentEvents: string[] = [];

	private model = {
		name: null,
		surname: null,
		data: null
  }
  //public demoReactiveForm;// = this.toFormGroup(this.model); 

  dataList: Array<any> = [];

  constructor(
    private cdr: ChangeDetectorRef,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
   console.log("ngOnInit event" );

   this.editorConfig = {
    language: 'fi',
    toolbar: [
       'heading', 'bulletedList', 'numberedList', 'fontFamily', 'heading',
       '|',
       'alignment',
       'bold', 'italic', 'link',
       'imageUpload','blockQuote',
       'undo', 'redo'
     ],
     heading: {
      options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
      ]
    },
    extraPlugins: [ ]
    };

   this.dataList = [
      { code: 1, name: "empty", data: "" },
      { code: 2, name: "short", data: "<h2>The three greatest things you learn from traveling</h2>"},
      { code: 3, name: "long", data: '<h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class="video right"><video controls="controls" alt="" src="https://cdn.filestackcontent.com/ipAfKGjQceafDZdkjH9q">&nbsp;</video></figure><h3>Appreciation of diversity</h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><blockquote><p>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</p><p><strong>Marcel Proust</strong></p></blockquote><h3>Improvisation</h3><p>Life doesn\'t allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>buy the ticket</li><li>start your adventure</li></ul><h3>Confidence</h3><p>Going to a new place can be quite terrifying. While change and uncertainty makes us scared, traveling teaches us how ridiculous it is to be afraid of something before it happens. The moment you face your fear and see there was nothing to be afraid of, is the moment you discover bliss.</p><h2>Walking the capitals of Europe: Warsaw</h2><p>If you enjoyed my previous articles in which we discussed wandering around <a href="https://en.wikipedia.org/wiki/Copenhagen">Copenhagen</a> and <a href="https://en.wikipedia.org/wiki/Vilnius">Vilnius</a>, you’ll definitely love exploring <a href="https://en.wikipedia.org/wiki/Warsaw">Warsaw</a>.</p><h3>Time to put comfy sandals on!</h3><p>Best time to visit the city is July and August, when it’s cool enough to not break a sweat and hot enough to enjoy summer. The city which has quite a combination of both old and modern textures is located by the river of Vistula.</p><p>The historic <strong>Old Town</strong>, which was reconstructed after the World War II, with its late 18th century characteristics, is a must-see. You can start your walk from the <strong>Nowy Świat Street</strong> which will take you straight to the Old Town.</p><p>Then you can go to the <strong>Powiśle</strong> area and take a walk on the newly renovated promenade on the riverfront. There are also lots of cafes, bars and restaurants where you can shake off the exhaustion of the day. On Sundays, there are many parks where you can enjoy nature or listen to pianists from around the world playing Chopin.</p><p>For museum lovers, you can add these to your list:</p><ul><li><a href="http://www.polin.pl/en">POLIN</a></li><li><a href="http://www.1944.pl/en">Warsaw Uprising Museum</a></li><li><a href="http://chopin.museum/en">Fryderyk Chopin Museum</a></li></ul><h3>Next destination</h3><p>We will go to Berlin and have a night\'s walk in the city that never sleeps! Make sure you subscribe to our newsletter!</p>'}
    ]
   
   // https://ckeditor.com/docs/ckeditor5/latest/api/module_editor-decoupled_decouplededitor-DecoupledEditor.html#static-function-create
  //  ClassicEditor.create(document.querySelector( '.document-editor__editable' ), 
  DecoupledEditor
      .create(document.querySelector( '.document-editor__editable' ), 
       this.editorConfig.toolbar
      )
      .then( editor => {
          console.log( 'Editor was initialized',
          Array.from( editor.ui.componentFactory.names() ));
          

          const toolbarContainer = document.querySelector( '.document-editor__toolbar' );
          toolbarContainer.appendChild( editor.ui.view.toolbar.element );
          this.Editor = editor;
      } )
      .catch( err => {
          console.error( err.stack );
      } );
    
  }

	ngAfterViewInit() {
     console.log("ngAfterViewInit event" );
    // this.demoReactiveForm = this.toFormGroup(this.model);
     this.cdr.detectChanges();

    // this.demoReactiveForm!.valueChanges
		// 	.subscribe( values => {
    //     console.log("valueChanges values", values );
		// 	  this.formDataPreview = JSON.stringify( values );
    //     this.cdr.detectChanges();
		// 	} );

  }

  toggleDisableEditors() {
    this.isReadOnly = !this.isReadOnly;
  }

  public get newData() {
    
    if (this.myEditor && this.myEditor.editorInstance) {
      console.log("newData:", this.myEditor.editorInstance.getData() );
      return this.myEditor.editorInstance.getData();
    }

    return '';
	}
  public onSubmit = (formValue) => {
    // if ( this.demoReactiveForm.valid) {
    //   console.log( 'Form submit, model', formValue );

    // }
  }
 	public reset() {
		// this.demoReactiveForm!.reset();
	}

  ngOnChanges(changes: SimpleChanges) {
      console.log("onChange event" );
       this.componentEvents.push('Editor model changed.')
  }


  public onReady( editor ) {
    console.log("onReady event", editor );
    if(editor) {
      editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
      );
    }
  }

  onChange(event: ChangeEvent): void {
    console.log("onChange:",event.editor.getData());
    this.componentEvents.push('onChange event, model change');
    this.cdr.detectChanges();
  }

  onFocus(event: FocusEvent): void {
     console.log('Focused the editing view.');
     this.componentEvents.push('Focused the editing view.');
  }

  onBlur(event: BlurEvent): void {
    //  console.log('Blurred the editing view.', event);
     this.componentEvents.push('Blurred the editing view.');
  }

  toFormGroup(model): FormGroup {
    console.log("toFormGroup" );

    return this.fb.group( {
    data: [model ? model.data : ""],
    name: [model ? model.name : ""],
    surname: [model ? model.surname : ""]
    } );

  }

  onChangeTemplate(deviceValue: number) {
     this.model.data = this.dataList.find(x => x.code == deviceValue).data;
     // this.reset();
    //  this.model.data = templateData;
    //  this.demoReactiveForm.controls['data'].setValue(templateData);
    //  this.demoReactiveForm.markAsDirty();
     // this.demoReactiveForm = this.toFormGroup(this.model);
  }

    public downloadAsPDF() {
    const doc = new JSPDF('p', 'mm', 'a4');

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    const pdfTable = this.pdfArea.nativeElement;
    // doc.text( this.model.data, 10, 10);
    doc.fromHTML(pdfTable.innerHTML, 10, 10, {
      pagesplit: true, margin: {top: 10, right: 10, bottom: 10, left: 10, useFor: 'page'},
      width: 100,
      'elementHandlers': specialElementHandlers
    });
    doc.save('a4.pdf')
  }
}


