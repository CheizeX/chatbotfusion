import {
  ContentTypes,
  DERIVATIONS,
  MessageFrom,
  FormProps,
  FormTypes,
} from './shared';

export const initialMessage = [
  {
    contentType: ContentTypes.TEXT,
    from: MessageFrom.BOT,
    content: `¡Hola, estoy aquí para guiarte en los servicios de mediQo!
      Selecciona una de las siguientes opciones:`,
  },
];

export const suggestionsObjNew = [
  // ----------------------- <MEDICO> -----------------------
  {
    name: 'Soy médico',
    // icon: HorasMedPresSVG,
    question: '¿Ya formas parte de nuestra red médica?',
    // derivation: DERIVATIONS.AGENT,
    subItems: [
      {
        name: 'Si',
        // icon: CamaraSVG,
        subItems: [
          {
            name: `Tengo dudas sobre la facturación`,
            options: [
              {
                text: 'Haz click aquí para resolver tus dudas',
                icon: '',
                link: 'https://www.google.com',
              },
            ],
          },
          {
            name: `No funciona mi plataforma`,
            options: [
              {
                text: 'Haz click aquí para asesorarte',
                icon: '',
                link: 'https://www.google.com',
              },
            ],
          },
          {
            name: `Necesito hablar con HELP DESK`,
            options: [
              {
                text: 'Haz click aquí para comunicarte con nosotros',
                icon: '',
                link: 'https://wa.me/+5493415848934',
              },
            ],
          },
        ],
      },
      {
        name: 'No',
        // icon: CamaraSVG,
        options: [
          {
            text: `Informes y registro`,
            icon: '',
            link: `https://medics.mediqo.com/join`,
          },
        ],
      },
    ],
  },

  // ----------------------- <PACIENTE> -----------------------

  {
    name: 'Soy paciente',
    // icon: MedicalSVG,
    question: '¿Qué necesitas?',
    subItems: [
      {
        name: 'Prueba COVID',
        // icon: SignpostSVG,
        subItems: [
          {
            name: 'Centro de diagnóstico',
            // icon: DiagnosesSVG,
            options: [
              {
                text: `El ingreso a Centro de Diagnóstico es por la calle Limache 1741 y se encuentra en el piso -1.`,
                icon: '',
                link: '',
              },
            ],
          },
          {
            name: 'Urgencia',
            // icon: EmergencySVG,
            options: [
              {
                text: `El ingreso a Urgencia es por la calle Limache 1741. Allí encontrará una anfitriona que le indicará dónde debe dirigirse.`,
                icon: '',
                link: '',
              },
            ],
          },
          {
            name: 'Admisión',
            // icon: AdmisionSVG,
            options: [
              {
                text: `El ingreso a Admisión es por la calle Limache 1741. Allí encontrará una anfitriona que le indicará dónde debe dirigirse.`,
                icon: '',
                link: '',
              },
            ],
          },
          {
            name: 'Centro Médico',
            // icon: MedicalSVG,
            options: [
              {
                text: `El ingreso a Centro Médico es por la calle Llay Llay 1726. En la entrada del
                piso 1 encontrará a las ejecutivas de Centro Médico quienes le ayudarán con su consulta
                médica.`,
                icon: '',
                link: '',
              },
            ],
          },
          {
            name: 'Laboratorio',
            // icon: LabSVG,
            options: [
              {
                text: `El ingreso a Centro Médico es por la calle Llay Llay 1726. Allí encontrará una anfitriona que le indicará dónde debe dirigirse.`,
                icon: '',
                link: '',
              },
            ],
          },
          {
            name: 'Poseo otra consulta en HCVM',
            // icon: QuestionSVG,
            options: [
              {
                text: `Si usted posee otra consulta en la Clínica, debes ingresar por la calle Llay Llay 1726, allí encontrará una anfitriona que le indicará dónde debe dirigirse.`,
                icon: '',
                link: '',
              },
            ],
          },
        ],
      },
      {
        name: 'Médico a domicilio',
        // icon: MicrobeSVG,
        subItems: [
          {
            name: '¿Realizan PCR?',
            // icon: HorasMedPresSVG,
            options: [
              {
                text: `Sólo realizamos PCR en el caso que sientas alguno de los síntomas
            provenientes de COVID-19 , en ese caso debe dirigirse a nuestro servicio de Urgencia donde le
            realizaremos la prueba.`,
                icon: '',
                link: ``,
              },
            ],
          },
          {
            name: '¿Qué hago si salí positivo en test de antígenos o PCR?',
            // icon: HorasMedPresSVG,
            options: [
              {
                text: `En el caso de salir positivo en el test de antígenos o la prueba PCR, debe
                esperar al llamado del MINSAL o del consultorio más cercano a su domicilio, en caso de que no se
                contacten con usted, debe comunicarse con 'Salud Responde'al te:56003607777. Recuerde que no debe salir por
                ningún motivo de su domicilio. ¡Cuidarse es responsabilidad de todos!`,
                icon: '',
                link: ``,
              },
            ],
          },
          {
            name: 'Deseo agendar vacunarme con vacuna COVID-19',
            // icon: HorasMedPresSVG,
            options: [
              {
                text: `Para agendar tu vacunación contra el COVID-19, debes llamar al 322323800, o
                contactarse por whatsapp al +56975878298 `,
                icon: '',
                link: ``,
              },
            ],
          },
        ],
      },
      {
        name: 'Asesoría Virtual',
        derivation: DERIVATIONS.LINK,
        derivationLink: 'https://wa.me/+5493415848934',
        // icon: OtrasConsultasSVG,
        options: [
          {
            text: 'Para cualquier otra duda, por favor comuníquese con nuestras ejecutivas al',
            // icon: TelefonoSVG,
            link: '',
          },
        ],
      },
      {
        name: 'Tuve problemas con mi servicio y necesito AYUDA',
        // icon: OtrasConsultasSVG,
        derivation: DERIVATIONS.FORM,
        derivationForm: [
          {
            name: 'Nombre',
            type: FormTypes.TEXT,
            placeholder: 'Ingresar nombre',
          },
          {
            name: 'Expediente',
            type: FormTypes.NUMBER,
            placeholder: 'Ingresar núm. de expediente',
          },
        ], // el array en el órden que se quieran mostrar los campos
      },
    ],
  },
];
